import type { LitResolver } from "@s2h/utils";
import { Messages } from "@s2h/utils";
import type { GetGameInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const getGameResolver: LitResolver<GetGameInput> = async ( { input, ctx } ) => {
	const userId = ctx.res.locals.userId as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true, teams: true, moves: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userId === userId );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	return game;
};