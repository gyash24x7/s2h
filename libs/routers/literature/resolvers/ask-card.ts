import type { LitResolver } from "@s2h/utils";
import type { AskCardInput } from "@s2h/dtos";
import { LitMoveType, LitPlayer } from "@prisma/client";

const askCardResolver: LitResolver<AskCardInput> = async ( { input, ctx } ) => {
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: {
			moves: {
				create: {
					askedFromId: input.askedFrom,
					askedById: loggedInPlayer.id,
					askedFor: { ...input.askedFor },
					type: LitMoveType.ASK
				}
			}
		}
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default askCardResolver;