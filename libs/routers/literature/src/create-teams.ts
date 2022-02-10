import { z } from "zod";
import { TrpcResolver } from "@s2h/utils/trpc";
import { LitGameStatus } from "@s2h/prisma";
import { GameResponse } from "./";
import { splitArray } from "@s2h/utils/deck";

export const createTeamsInput = z.object( {
	teams: z.array( z.string().nonempty() ).length( 2 ),
	gameId: z.string().cuid()
} );

export type CreateTeamsInput = z.infer<typeof createTeamsInput>

export const createTeamsResolver: TrpcResolver<CreateTeamsInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game not found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	if ( game.players.length !== game.playerCount ) {
		return { error: "A game needs to have 6 players. Not enough players!" };
	}

	const playerGroups = splitArray( game.players );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.TEAMS_CREATED,
			teams: {
				create: input.teams.map( ( t, index ) => (
					{
						name: t,
						players: {
							connect: playerGroups[ index ].map( ( { id } ) => (
								{ id }
							) )
						}
					}
				) )
			}
		}
	} );

	return { data: updatedGame };
};