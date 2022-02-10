import { TrpcResolver } from "@s2h/utils/trpc";
import { z } from "zod";
import cuid from "cuid";
import { GameResponse } from "./";

export const createGameInput = z.object( {
	name: z.string().nonempty()
} );

export type CreateGameInput = z.infer<typeof createGameInput>

export const createGameResolver: TrpcResolver<CreateGameInput, GameResponse> = async ( { ctx, input } ) => {
	const userId = ctx.session!.userId as string;
	const userAvatar = ctx.session.profilePic as string;
	const player = await ctx.prisma.litPlayer.create( { data: { name: input.name, userId, avatar: userAvatar } } );

	const game = await ctx.prisma.litGame.create( {
		data: {
			code: cuid.slug().toUpperCase(),
			players: { connect: [ { id: player.id } ] }
		}
	} );

	return { data: game };
};