import type { LitResolver } from "@s2h/utils";
import type { GetGameInput } from "@s2h/dtos";
import type { LitGame } from "@prisma/client";

const getGameResolver: LitResolver<GetGameInput> = async ( { ctx } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;
	return game!;
};

export default getGameResolver;