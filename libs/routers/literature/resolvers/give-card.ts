import type { LitResolver } from "@s2h/utils";
import { CardHand, GameCard, LitGameWithPlayers, Messages } from "@s2h/utils";
import { LitMoveType, LitPlayer } from "@prisma/client";
import type { GiveCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const giveCardResolver: LitResolver<GiveCardInput> = async ( { input, ctx } ) => {
	const game: LitGameWithPlayers = ctx.res?.locals.currentGame;
	const givingPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const takingPlayer = game.players.find( player => player.id === input.giveTo );

	if ( !takingPlayer ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.PLAYER_NOT_FOUND } );
	}

	const cardToGive = new GameCard( input.cardToGive.rank, input.cardToGive.suit );
	const givingPlayerHand = CardHand.from( givingPlayer.hand );
	const takingPlayerHand = CardHand.from( takingPlayer.hand );

	if ( !givingPlayerHand.contains( cardToGive ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_GIVE_CARD } );
	}

	givingPlayerHand.removeGameCard( cardToGive );
	takingPlayerHand.addCard( cardToGive );

	await Promise.all( [
		ctx.prisma.litPlayer.update( {
			where: { id: givingPlayer.id },
			data: { hand: givingPlayerHand.serialize() }
		} ),
		ctx.prisma.litPlayer.update( {
			where: { id: takingPlayer.id },
			data: { hand: takingPlayerHand.serialize() }
		} )
	] );

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.GIVEN, turnId: takingPlayer.id } ] } }
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default giveCardResolver;