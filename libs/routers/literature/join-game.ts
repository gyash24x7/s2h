import { Messages } from "@s2h/utils";
import { LitGameStatus } from "@prisma/client";
import type { JoinGameInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";
import type { LitResolver } from "./index";

export const joinGameResolver: LitResolver<JoinGameInput> = async ( { ctx, input } ) => {
	const userEmail = ctx.session?.user?.email!;
	const avatar = ctx.session?.user?.image!;

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

	const userAlreadyInGame = !!game.players.find( player => player.userEmail === userEmail );
	if ( userAlreadyInGame ) {
		return game;
	}

	const player = await ctx.prisma.litPlayer.create( { data: { name: input.name, userEmail, avatar } } );

	return ctx.prisma.litGame.update( {
		where: { id: game.id },
		data: {
			status: game.players.length === game.playerCount - 1
				? LitGameStatus.PLAYERS_READY
				: LitGameStatus.NOT_STARTED,
			players: { connect: [ { id: player.id } ] }
		}
	} );
};