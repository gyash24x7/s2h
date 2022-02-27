import { Messages, splitArray } from "@s2h/utils";
import { LitGameStatus } from "@prisma/client";
import type { CreateTeamsInput } from "@s2h/dtos";
import type { LitResolver } from "./index";
import { TRPCError } from "@trpc/server";

export const createTeamsResolver: LitResolver<CreateTeamsInput> = async ( { input, ctx } ) => {
	const loggedInUserEmail = ctx.session?.user?.email!;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userEmail === loggedInUserEmail );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	if ( game.players.length !== game.playerCount ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.NOT_ENOUGH_PLAYERS } );
	}

	const playerGroups = splitArray( game.players );

	return ctx.prisma.litGame.update( {
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
};