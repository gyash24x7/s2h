import type { LitResolver } from "@s2h/utils";
import { CardHand, GameCard, Messages } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { GiveCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const giveCardResolver: LitResolver<GiveCardInput> = async ( { input, ctx } ) => {
	const userId = ctx.res?.locals.userId as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const givingPlayer = game.players.find( player => player.userId === userId );

	if ( !givingPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

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