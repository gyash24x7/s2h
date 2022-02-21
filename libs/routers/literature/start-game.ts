import { LitGameStatus, LitMoveType } from "@s2h/prisma";
import type { TrpcResolver } from "@s2h/utils";
import { Deck, getCardString, Rank } from "@s2h/utils";
import type { GameResponse, StartGameInput } from "@s2h/dtos";

export const startGameResolver: TrpcResolver<StartGameInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await ctx.prisma.litGame.findFirst( {
		where: { id: input.gameId, status: LitGameStatus.TEAMS_CREATED },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game not found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const deck = new Deck();
	const hands = deck.removeCardsOfRank( Rank.SEVEN ).generateHands( 6 );

	await Promise.all(
		game.players.map(
			( player, i ) => ctx.prisma.litPlayer.update( {
				where: { id: player.id },
				data: { hand: { set: hands[ i ]!.map( getCardString ) } }
			} )
		)
	);

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: { create: [ { type: LitMoveType.TURN, turnId: loggedInPlayer.id } ] }
		}
	} );

	return { data: updatedGame };
};