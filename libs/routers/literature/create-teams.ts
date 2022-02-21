import type { TrpcResolver } from "@s2h/utils";
import { splitArray } from "@s2h/utils";
import { LitGameStatus } from "@s2h/prisma";
import type { CreateTeamsInput, GameResponse } from "@s2h/dtos";

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