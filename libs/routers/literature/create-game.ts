import cuid from "cuid";
import type { CreateGameInput } from "@s2h/dtos";
import type { LitResolver } from "./index";

export const createGameResolver: LitResolver<CreateGameInput> = async ( { ctx, input } ) => {
	const userEmail = ctx.session?.user?.email!;
	const avatar = ctx.session?.user?.image!;
	const player = await ctx.prisma.litPlayer.create( { data: { name: input.name, userEmail, avatar } } );

	return ctx.prisma.litGame.create( {
		data: {
			code: cuid.slug().toUpperCase(),
			players: { connect: [ { id: player.id } ] }
		}
	} );
};