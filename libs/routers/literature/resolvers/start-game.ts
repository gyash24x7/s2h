import { LitGameStatus, LitMoveType, LitPlayer } from "@prisma/client";
import type { LitResolver } from "@s2h/utils";
import { CardRank, Deck, LitGameWithPlayers } from "@s2h/utils";
import type { StartGameInput } from "@s2h/dtos";

const startGameResolver: LitResolver<StartGameInput> = async ( { input, ctx } ) => {
	const game: LitGameWithPlayers = ctx.res?.locals.currentGame;
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const deck = new Deck();
	const hands = deck.removeCardsOfRank( CardRank.SEVEN ).generateHands( game.playerCount );

	await Promise.all(
		game.players.map(
			( player, i ) => ctx.prisma.litPlayer.update( {
				where: { id: player.id },
				data: { hand: hands[ i ].serialize() }
			} )
		)
	);

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: { create: [ { type: LitMoveType.TURN, turnId: loggedInPlayer.id } ] }
		}
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default startGameResolver;