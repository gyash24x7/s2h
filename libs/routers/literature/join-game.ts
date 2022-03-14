import type { LitResolver } from "@s2h/utils";
import { Messages } from "@s2h/utils";
import { LitGameStatus, User } from "@prisma/client";
import type { JoinGameInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const joinGameResolver: LitResolver<JoinGameInput> = async ( { ctx, input } ) => {
	const { name, avatar, id } = ctx.res?.locals.user as User;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { code: input.code },
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const userAlreadyInGame = !!game.players.find( player => player.userId === id );
	if ( userAlreadyInGame ) {
		return game;
	}

	if ( game.players.length >= game.playerCount ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.PLAYER_CAPACITY_FULL } );
	}

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: game.id },
		data: {
			status: game.players.length === game.playerCount - 1
				? LitGameStatus.PLAYERS_READY
				: LitGameStatus.NOT_STARTED,
			players: { create: { name, avatar, userId: id, hand: [] } }
		}
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};