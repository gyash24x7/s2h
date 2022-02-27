import { Messages } from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { LitGameStatus, LitMoveType } from "@prisma/client";
import type { TransferTurnInput } from "@s2h/dtos";
import type { LitResolver } from "./index";
import { TRPCError } from "@trpc/server";

export const transferTurnResolver: LitResolver<TransferTurnInput> = async ( { input, ctx } ) => {
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
		return ctx.prisma.litGame.update( {
			where: { id: input.gameId },
			data: { status: LitGameStatus.COMPLETED }
		} );
	}

	const nextPlayer = myTeamPlayersWithCards.length === 0
		? otherTeamPlayersWithCards[ 0 ]!
		: myTeamPlayersWithCards[ 0 ]!;

	return ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.TURN, turnId: nextPlayer.id } ] } }
	} );
};
