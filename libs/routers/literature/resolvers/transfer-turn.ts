import type { LitResolver } from "@s2h/utils";
import { CardHand, Messages } from "@s2h/utils";
import type { LitGame, LitPlayer } from "@prisma/client";
import { LitGameStatus, LitMoveType } from "@prisma/client";
import type { TransferTurnInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const transferTurnResolver: LitResolver<TransferTurnInput> = async ( { input, ctx } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	if ( CardHand.from( loggedInPlayer.hand ).length() !== 0 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_TRANSFER } );
	}

	const myTeamPlayersWithCards: LitPlayer[] = [];
	const otherTeamPlayersWithCards: LitPlayer[] = [];

	game.players.forEach( player => {
		if ( CardHand.from( player.hand ).length() !== 0 ) {
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

		ctx.namespace?.emit( game.id, updatedGame );
		return updatedGame;
	}

	const nextPlayer = myTeamPlayersWithCards.length === 0
		? otherTeamPlayersWithCards[ 0 ]!
		: myTeamPlayersWithCards[ 0 ]!;

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				push: { type: LitMoveType.TURN, turnId: nextPlayer.id }
			}
		}
	} );

	ctx.namespace?.emit( game.id, updatedGame );
	return updatedGame;
};

export default transferTurnResolver;
