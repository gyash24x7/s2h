import type { LitResolver } from "@s2h/utils";
import { CardHand, GameCard, Messages } from "@s2h/utils";
import { LitMoveType, LitPlayer } from "@prisma/client";
import type { DeclineCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const declineCardResolver: LitResolver<DeclineCardInput> = async ( { ctx, input } ) => {
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const cardDeclined = new GameCard( input.cardDeclined.rank, input.cardDeclined.suit );
	const playerHand = CardHand.from( loggedInPlayer.hand );

	if ( playerHand.contains( cardDeclined ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_DECLINE_CARD } );
	}

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: {
			moves: {
				create: {
					type: LitMoveType.DECLINED,
					turnId: loggedInPlayer.id
				}
			}
		}
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default declineCardResolver;