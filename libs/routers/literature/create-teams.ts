import type { LitResolver } from "@s2h/utils";
import { Messages, splitArray } from "@s2h/utils";
import { LitGameStatus } from "@prisma/client";
import type { CreateTeamsInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const createTeamsResolver: LitResolver<CreateTeamsInput> = async ( { input, ctx } ) => {
	const userId = ctx.res?.locals.userId as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userId === userId );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	if ( game.players.length !== game.playerCount ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.NOT_ENOUGH_PLAYERS } );
	}

	const playerGroups = splitArray( game.players );

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "asc" } }, createdBy: true },
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

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};