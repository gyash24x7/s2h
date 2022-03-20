import type { LitResolver } from "@s2h/utils";
import { CardHand, GameCard, includesAll, LitGameWithPlayers, Messages } from "@s2h/utils";
import { LitMoveType, LitPlayer } from "@prisma/client";
import type { CallSetInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const callSetResolver: LitResolver<CallSetInput> = async ( { input, ctx } ) => {
	const game: LitGameWithPlayers = ctx.res?.locals.currentGame;
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const cardsCalled = Object.values( input.data ).flat().map( card => new GameCard( card.rank, card.suit ) );
	const cardSets = Array.from( new Set( cardsCalled.map( card => card.getCardSet() ) ) );

	if ( cardSets.length !== 1 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_CARDS_OF_SAME_SET } );
	}

	if ( cardsCalled.length !== 6 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_ALL_CARDS } );
	}

	const myTeamPlayers = game.players.filter( player => player.teamId === loggedInPlayer.teamId );
	const otherTeamPlayers = game.players.filter( player => player.teamId !== loggedInPlayer.teamId );
	const otherTeamId = otherTeamPlayers[ 0 ]!.teamId!;

	const playerIdsWithCards = Array.from( Object.keys( input.data ) );
	if ( !includesAll( myTeamPlayers.map( player => player.id ), playerIdsWithCards ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_WITHIN_YOUR_TEAM } );
	}

	await ctx.prisma.litMove.create( {
		data: {
			type: LitMoveType.CALL,
			callingSet: cardSets[ 0 ],
			gameId: input.gameId,
			turnId: loggedInPlayer.id
		}
	} );

	let cardsCalledCorrect = 0;
	myTeamPlayers.forEach( ( { id, hand } ) => {
		const cardsCalledForPlayer = input.data[ id ].map( ( { rank, suit } ) => new GameCard( rank, suit ) );
		if ( !!cardsCalledForPlayer ) {
			if ( CardHand.from( hand ).containsAll( cardsCalledForPlayer ) ) {
				cardsCalledCorrect += cardsCalledForPlayer.length;
			}
		}
	} );

	let moveData: { type: LitMoveType, turnId: string } | undefined;

	if ( cardsCalledCorrect === 6 ) {
		await ctx.prisma.litTeam.update( {
			where: { id: loggedInPlayer.teamId! },
			data: { score: { increment: 1 } }
		} );

		moveData = { type: LitMoveType.CALL_SUCCESS, turnId: loggedInPlayer.id };
	} else {
		await ctx.prisma.litTeam.update( {
			where: { id: otherTeamId },
			data: { score: { increment: 1 } }
		} );

		moveData = { type: LitMoveType.CALL_FAIL, turnId: otherTeamPlayers[ 0 ].id };
	}

	const playersWithCardsCalled = game.players.filter(
		player => CardHand.from( player.hand ).containsSome( cardsCalled )
	);

	await Promise.all( playersWithCardsCalled.map( player => {
		const newHand = CardHand.from( player.hand );
		newHand.removeCardsOfSet( cardSets[ 0 ] );

		return ctx.prisma.litPlayer.update( {
			where: { id: player.id },
			data: { hand: newHand.serialize() }
		} );
	} ) );

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "desc" } }, createdBy: true },
		where: { id: input.gameId },
		data: { moves: { create: [ moveData ] } }
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};

export default callSetResolver;