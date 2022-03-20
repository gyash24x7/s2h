import type { LitResolver } from "@s2h/utils";
import { LitGameWithPlayers, Messages, splitArray } from "@s2h/utils";
import { LitGameStatus } from "@prisma/client";
import type { CreateTeamsInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const createTeamsResolver: LitResolver<CreateTeamsInput> = async ( { input, ctx } ) => {
	const game: LitGameWithPlayers = ctx.res?.locals.currentGame;

	if ( game.players.length !== game.playerCount ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.NOT_ENOUGH_PLAYERS } );
	}

	const playerGroups = splitArray( game.players );

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
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

export default createTeamsResolver;