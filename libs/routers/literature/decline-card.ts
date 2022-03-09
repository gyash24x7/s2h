import type { LitResolver } from "@s2h/utils";
import { getCardString, Messages } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { DeclineCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const declineCardResolver: LitResolver<DeclineCardInput> = async ( { ctx, input } ) => {
	const userId = ctx.res?.locals.userId as string;
	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userId === userId );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	const playerHasCard = loggedInPlayer.hand.includes( getCardString( input.cardDeclined ) );
	if ( playerHasCard ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_DECLINE_CARD } );
	}

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.DECLINED, turnId: loggedInPlayer.id } ] } }
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};