import { getCardString, Messages } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { DeclineCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";
import type { LitResolver } from "./index";

export const declineCardResolver: LitResolver<DeclineCardInput> = async ( { ctx, input } ) => {
	const loggedInUserEmail = ctx.session?.user?.email!;
	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userEmail === loggedInUserEmail );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	const playerHasCard = loggedInPlayer.hand.includes( getCardString( input.cardDeclined ) );
	if ( playerHasCard ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_DECLINE_CARD } );
	}

	return ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.DECLINED, turn: loggedInPlayer } ] } }
	} );
};