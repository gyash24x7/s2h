import { z } from "zod";
import { TrpcResolver } from "@s2h/utils/trpc";
import { LitGameStatus } from "@s2h/prisma";
import { GameResponse } from "./";

export const joinGameInput = z.object( {
	code: z.string().length( 7 ),
	name: z.string().nonempty()
} );

export type JoinGameInput = z.infer<typeof joinGameInput>

export const joinGameResolver: TrpcResolver<JoinGameInput, GameResponse> = async ( { ctx, input } ) => {
	const userId = ctx.session?.userId! as string;
	const userAvatar = ctx.session?.profilePic as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { code: input.code },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game not found!" };
	}

	if ( game.players.length >= game.playerCount ) {
		return { error: `Game already has ${ game.playerCount } players. Cannot join!` };
	}

	const userAlreadyInGame = !!game.players.find( player => player.userId === userId );
	if ( userAlreadyInGame ) {
		return { error: "You have already joined the game!" };
	}

	const player = await ctx.prisma.litPlayer.create( { data: { name: input.name, userId, avatar: userAvatar } } );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: game.id },
		data: {
			status: game.players.length === game.playerCount - 1
				? LitGameStatus.PLAYERS_READY
				: LitGameStatus.NOT_STARTED,
			players: { connect: [ { id: player.id } ] }
		}
	} );

	return { data: updatedGame };
};