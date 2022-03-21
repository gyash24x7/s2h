import type { LitResolver } from "@s2h/utils";
import { Messages, shuffle, splitArray } from "@s2h/utils";
import { LitGame, LitGameStatus, LitPlayer } from "@prisma/client";
import type { CreateTeamsInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";
import cuid from "cuid";

const createTeamsResolver: LitResolver<CreateTeamsInput> = async ( { input, ctx } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;

	if ( game.status !== LitGameStatus.PLAYERS_READY ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_GAME_STATUS } );
	}

	if ( game.players.length !== game.playerCount ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.NOT_ENOUGH_PLAYERS } );
	}

	const playerGroups = splitArray( shuffle( game.players ) );

	const teamData = input.teams.map( ( name, index ) => (
		{ name, players: playerGroups[ index ].map( player => player.id ), id: cuid() }
	) );

	const playerData: LitPlayer[] = playerGroups.flatMap( ( group, i ) => group.map( player => (
		{ ...player, teamId: teamData[ i ].id }
	) ) );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.TEAMS_CREATED,
			teams: { set: teamData },
			players: { set: playerData }
		}
	} );

	ctx.namespace?.emit( game.id, updatedGame );
	return updatedGame;
};

export default createTeamsResolver;