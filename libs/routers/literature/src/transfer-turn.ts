import { z } from "zod";
import { TrpcResolver } from "@s2h/utils/trpc";
import { GameResponse } from "./";
import { LitGameStatus, LitMoveType, LitPlayer } from "@s2h/prisma";

export const transferTurnInput = z.object( {
	gameId: z.string().nonempty().cuid()
} );

export type TransferTurnInput = z.infer<typeof transferTurnInput>

export const transferTurnResolver: TrpcResolver<TransferTurnInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;
	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game Not Found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	if ( loggedInPlayer.hand.length !== 0 ) {
		return { error: "You can transfer chance only when you don't have cards!" };
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
			where: { id: input.gameId },
			data: { status: LitGameStatus.COMPLETED }
		} );

		return { data: updatedGame };
	}

	const nextPlayer = myTeamPlayersWithCards.length === 0
		? otherTeamPlayersWithCards[ 0 ]
		: myTeamPlayersWithCards[ 0 ];

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.TURN, turnId: nextPlayer.id } ] } }
	} );

	return { data: updatedGame };
};
