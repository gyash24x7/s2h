import type { LitGameWithPlayers, LitResolver } from "@s2h/utils";
import type { GetGameInput } from "@s2h/dtos";

const getGameResolver: LitResolver<GetGameInput> = async ( { ctx } ) => {
	const game: LitGameWithPlayers = ctx.res?.locals.currentGame;

	const litGameData = await ctx.prisma.litGame.findUnique( {
		where: { id: game.id },
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true }
	} );

	return litGameData!;
};

export default getGameResolver;