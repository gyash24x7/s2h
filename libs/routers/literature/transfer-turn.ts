import type { LitResolver } from "@s2h/utils";
import { Messages } from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { LitGameStatus, LitMoveType } from "@prisma/client";
import type { TransferTurnInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const transferTurnResolver: LitResolver<TransferTurnInput> = async ( { input, ctx } ) => {
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

	if ( loggedInPlayer.hand.length !== 0 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_TRANSFER } );
	}

	const myTeamPlayersWithCards: LitPlayer[] = [];
	const otherTeamPlayersWithCards: LitPlayer[] = [];

	game.players.forEach( player => {
		if ( player.hand.length !== 0 ) {
			if ( player.teamId === loggedInPlayer.teamId ) {
				myTeamPlayersWithCards.push( player );
			} else {
				otherTeamPlayersWithCards.push( player );
			}
		}
	} );

	if ( myTeamPlayersWithCards.length === 0 && otherTeamPlayersWithCards.length === 0 ) {
		const updatedGame = await ctx.prisma.litGame.update( {
			include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
			where: { id: input.gameId },
			data: { status: LitGameStatus.COMPLETED }
		} );

		ctx.ee.emit( updatedGame.id, updatedGame );
		return updatedGame;
	}

	const nextPlayer = myTeamPlayersWithCards.length === 0
		? otherTeamPlayersWithCards[ 0 ]!
		: myTeamPlayersWithCards[ 0 ]!;

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.TURN, turnId: nextPlayer.id } ] } }
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};
