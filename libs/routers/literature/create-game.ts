import cuid from "cuid";
import type { LitResolver } from "@s2h/utils";
import type { CreateGameInput } from "@s2h/dtos";

export const createGameResolver: LitResolver<CreateGameInput> = async ( { ctx, input } ) => {
	const userId = ctx.res.locals.userId as string;

	return ctx.prisma.litGame.create( {
		data: {
			code: cuid.slug().toUpperCase(),
			players: { connect: [ { userId } ] },
			playerCount: input.playerCount
		}
	} );
};