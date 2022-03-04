import { LitGameStatus, LitMoveType } from "@prisma/client";
import type { LitResolver } from "@s2h/utils";
import { Deck, getCardString, Messages, Rank } from "@s2h/utils";
import type { StartGameInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const startGameResolver: LitResolver<StartGameInput> = async ( { input, ctx } ) => {
	const userId = ctx.res.locals.userId as string;

	const game = await ctx.prisma.litGame.findFirst( {
		where: { id: input.gameId, status: LitGameStatus.TEAMS_CREATED },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userId === userId );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
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

	return ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: { create: [ { type: LitMoveType.TURN, turnId: loggedInPlayer.id } ] }
		}
	} );
};