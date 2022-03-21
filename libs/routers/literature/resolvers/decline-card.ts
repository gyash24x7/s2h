import type { LitResolver } from "@s2h/utils";
import { CardHand, Messages } from "@s2h/utils";
import { LitGame, LitMoveType, LitPlayer } from "@prisma/client";
import type { DeclineCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const declineCardResolver: LitResolver<DeclineCardInput> = async ( { ctx, input } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;
	const playerHand = CardHand.from( loggedInPlayer.hand );

	if ( playerHand.contains( input.cardDeclined ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_DECLINE_CARD } );
	}

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				set: [
					{ type: LitMoveType.DECLINED, turnId: loggedInPlayer.id },
					...game.moves
				]
			}
		}
	} );

	ctx.namespace?.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default declineCardResolver;