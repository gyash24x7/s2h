import type { LitResolver } from "@s2h/utils";
import {
	cardSetMap,
	getCardSet,
	getCardString,
	includesAll,
	includesSome,
	Messages,
	removeIfPresent
} from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { LitMoveType } from "@prisma/client";
import type { CallSetInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const callSetResolver: LitResolver<CallSetInput> = async ( { input, ctx } ) => {
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

	const cardsCalled = Array.from( input.data.values() ).flat();
	if ( cardsCalled.length !== 6 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_ALL_CARDS } );
	}

	const cardSet = getCardSet( cardsCalled[ 0 ]! );

	if ( !includesAll( cardSetMap[ cardSet ], cardsCalled ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_CARDS_OF_SAME_SET } );
	}

	if ( input.set !== cardSet ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_CARDS_OF_MENTIONED_SET } );
	}

	const myTeamPlayers = game.players.filter( player => player.teamId === loggedInPlayer.teamId );
	const otherTeamPlayers = game.players.filter( player => player.teamId !== loggedInPlayer.teamId );
	const otherTeamId = otherTeamPlayers[ 0 ]!.teamId!;

	const playerIdsWithCards = Array.from( input.data.keys() );
	if ( !includesAll( myTeamPlayers.map( player => player.id ), playerIdsWithCards ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_WITHIN_YOUR_TEAM } );
	}

	let cardsCalledCorrect = 0;
	myTeamPlayers.forEach( ( { id, hand } ) => {
		const cardsCalledForPlayer = input.data.get( id );
		if ( !!cardsCalledForPlayer ) {
			if ( includesAll( hand, cardsCalledForPlayer.map( getCardString ) ) ) {
				cardsCalledCorrect += cardsCalledForPlayer.length;
			}
		}
	} );

	let moveData: { type: LitMoveType, turn: LitPlayer } | undefined;

	if ( cardsCalledCorrect === 6 ) {
		await ctx.prisma.litTeam.update( {
			where: { id: loggedInPlayer.teamId! },
			data: { score: { increment: 1 } }
		} );

		moveData = { type: LitMoveType.CALL_SUCCESS, turn: loggedInPlayer };
	} else {
		await ctx.prisma.litTeam.update( {
			where: { id: otherTeamId },
			data: { score: { increment: 1 } }
		} );

		moveData = { type: LitMoveType.CALL_FAIL, turn: otherTeamPlayers[ 0 ]! };
	}

	const playersWithCardsCalled = game.players.filter( player => includesSome(
		player.hand,
		cardsCalled.map( getCardString )
	) );

	await Promise.all( playersWithCardsCalled.map( player => ctx.prisma.litPlayer.update( {
		where: { id: player.id },
		data: { hand: { set: removeIfPresent( player.hand, cardsCalled.map( getCardString ) ) } }
	} ) ) );

	const updatedGame = await ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: { orderBy: { createdAt: "asc" } }, createdBy: true },
		where: { id: input.gameId },
		data: { moves: { create: [ moveData ] } }
	} );

	ctx.ee.emit( updatedGame.id, updatedGame );
	return updatedGame;
};