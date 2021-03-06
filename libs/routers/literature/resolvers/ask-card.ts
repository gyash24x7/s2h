import type { LitResolver } from "@s2h/utils";
import type { AskCardInput } from "@s2h/dtos";
import { LitMoveType, LitPlayer } from "@prisma/client";

const askCardResolver: LitResolver<AskCardInput> = async ( { input, ctx } ) => {
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				push: [
					{
						askedFromId: input.askedFrom,
						askedById: loggedInPlayer.id,
						askedFor: { ...input.askedFor },
						type: LitMoveType.ASK
					}
				]
			}
		}
	} );

	ctx.namespace?.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default askCardResolver;