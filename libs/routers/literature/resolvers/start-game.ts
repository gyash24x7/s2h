import { CardRank, LitGame, LitGameStatus, LitMoveType, LitPlayer } from "@prisma/client";
import type { LitResolver } from "@s2h/utils";
import { Deck } from "@s2h/utils";
import type { StartGameInput } from "@s2h/dtos";

const startGameResolver: LitResolver<StartGameInput> = async ( { input, ctx } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const deck = new Deck();
	const hands = deck.removeCardsOfRank( CardRank.SEVEN ).generateHands( game.playerCount );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: {
				push: { type: LitMoveType.TURN, turnId: loggedInPlayer.id }
			},
			players: {
				set: game.players.map( ( player, i ) => (
					{ ...player, hand: hands[ i ].cards }
				) )
			}
		}
	} );

	ctx.namespace?.emit( game.id, updatedGame );
	return updatedGame;
};

export default startGameResolver;