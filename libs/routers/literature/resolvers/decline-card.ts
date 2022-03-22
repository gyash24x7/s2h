import type { LitResolver } from "@s2h/utils";
import { CardHand, Messages } from "@s2h/utils";
import { LitMoveType, LitPlayer } from "@prisma/client";
import type { DeclineCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const declineCardResolver: LitResolver<DeclineCardInput> = async ( { ctx, input } ) => {
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;
	const playerHand = CardHand.from( loggedInPlayer.hand );

	if ( playerHand.contains( input.cardDeclined ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_DECLINE_CARD } );
	}

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				push: { type: LitMoveType.DECLINED, turnId: loggedInPlayer.id }
			}
		}
	} );

	ctx.namespace?.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default declineCardResolver;