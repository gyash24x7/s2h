import cuid from "cuid";
import type { LitResolver } from "@s2h/utils";
import type { CreateGameInput } from "@s2h/dtos";
import type { User } from "@prisma/client";

export const createGameResolver: LitResolver<CreateGameInput> = async ( { ctx, input } ) => {
	const { name, avatar, id } = ctx.res?.locals.user as User;

	return ctx.prisma.litGame.create( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "asc" } }, createdBy: true },
		data: {
			createdById: id,
			code: cuid.slug().toUpperCase(),
			players: { create: { name, avatar, userId: id } },
			playerCount: input.playerCount
		}
	} );
};