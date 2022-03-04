import type { LitResolver } from "@s2h/utils";
import { Messages } from "@s2h/utils";
import { LitGameStatus } from "@prisma/client";
import type { JoinGameInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const joinGameResolver: LitResolver<JoinGameInput> = async ( { ctx, input } ) => {
	const userId = ctx.res.locals.userId as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { code: input.code },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	if ( game.players.length >= game.playerCount ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.PLAYER_CAPACITY_FULL } );
	}

	const userAlreadyInGame = !!game.players.find( player => player.userId === userId );
	if ( userAlreadyInGame ) {
		return game;
	}

	return ctx.prisma.litGame.update( {
		where: { id: game.id },
		data: {
			status: game.players.length === game.playerCount - 1
				? LitGameStatus.PLAYERS_READY
				: LitGameStatus.NOT_STARTED,
			players: { connect: [ { userId } ] }
		}
	} );
};