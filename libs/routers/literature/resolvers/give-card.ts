import type { LitResolver } from "@s2h/utils";
import { CardHand, Messages } from "@s2h/utils";
import { LitGame, LitMoveType, LitPlayer } from "@prisma/client";
import type { GiveCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const giveCardResolver: LitResolver<GiveCardInput> = async ( { input, ctx } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;
	const givingPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const takingPlayer = game.players.find( player => player.id === input.giveTo );

	if ( !takingPlayer ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.PLAYER_NOT_FOUND } );
	}

	const givingPlayerHand = CardHand.from( givingPlayer.hand );
	const takingPlayerHand = CardHand.from( takingPlayer.hand );

	if ( !givingPlayerHand.contains( input.cardToGive ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_GIVE_CARD } );
	}

	givingPlayerHand.removeCard( input.cardToGive );
	takingPlayerHand.addCard( input.cardToGive );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				set: [
					{ type: LitMoveType.GIVEN, turnId: takingPlayer.id },
					...game.moves
				]
			},
			players: {
				set: game.players.map( player => {
					if ( player.id === givingPlayer.id ) {
						return { ...player, hand: givingPlayerHand.cards };
					}
					if ( player.id === takingPlayer.id ) {
						return { ...player, hand: takingPlayerHand.cards };
					}
					return player;
				} )
			}
		}
	} );

	ctx.namespace?.emit( game.id, updatedGame );
	return updatedGame;
};

export default giveCardResolver;