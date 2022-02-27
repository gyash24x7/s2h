import type { TrpcResolver } from "@s2h/utils";
import { getCardString } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { DeclineCardInput, GameResponse } from "@s2h/dtos";

export const declineCardResolver: TrpcResolver<DeclineCardInput, GameResponse> = async ( { ctx, input } ) => {
	const loggedInUserId = ctx.session?.userId! as string;
	const game = await ctx.prisma.litGame.findUnique( { where: { id: input.gameId }, include: { players: true } } );

	if ( !game ) {
		return { error: "Game Not Found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const playerHasCard = loggedInPlayer.hand.includes( getCardString( input.cardDeclined ) );

	if ( playerHasCard ) {
		return { error: "You cannot decline a card that you have!" };
	}

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.DECLINED, turn: loggedInPlayer } ] } }
	} );

	return { data: updatedGame };
};