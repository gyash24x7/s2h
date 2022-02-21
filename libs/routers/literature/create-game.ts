import type { TrpcResolver } from "@s2h/utils";
import cuid from "cuid";
import type { CreateGameInput, GameResponse } from "@s2h/dtos";

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