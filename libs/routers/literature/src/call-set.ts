import { z } from "zod";
import {
	CardSet,
	cardSetMap,
	getCardSet,
	getCardString,
	includesAll,
	includeSome,
	removeIfPresent,
	zodGameCard
} from "@s2h/utils/deck";
import { LitMoveType, LitPlayer } from "@s2h/prisma";
import { TrpcResolver } from "@s2h/utils/trpc";
import { GameResponse } from "./";

export const callSetInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	set: z.nativeEnum( CardSet ),
	data: z.map( z.string().cuid(), z.array( zodGameCard ) )
} );

export type CallSetInput = z.infer<typeof callSetInput>

export const callSetResolver: TrpcResolver<CallSetInput, GameResponse> = async ( { input, ctx } ) => {
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

	const cardsCalled = Array.from( input.data.values() ).flat();
	if ( cardsCalled.length !== 6 ) {
		return { error: "Select all cards of the set to call!" };
	}

	const cardSet = getCardSet( cardsCalled[ 0 ] );

	if ( !includesAll( cardSetMap[ cardSet ], cardsCalled ) ) {
		return { error: "All cards don't belong to the same set!" };
	}

	if ( input.set !== cardSet ) {
		return { error: "Cards and Set don't match!" };
	}

	const myTeamPlayers = game.players.filter( player => player.teamId === loggedInPlayer.teamId );
	const otherTeamPlayers = game.players.filter( player => player.teamId !== loggedInPlayer.teamId );
	const otherTeamId = otherTeamPlayers[ 0 ].teamId!;

	const playerIdsWithCards = Array.from( input.data.keys() );
	if ( !includesAll( myTeamPlayers.map( player => player.id ), playerIdsWithCards ) ) {
		return { error: "You can only call set from within your team!" };
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

		moveData = { type: LitMoveType.CALL_FAIL, turn: otherTeamPlayers[ 0 ] };
	}

	const playersWithCardsCalled = game.players.filter( player => includeSome(
		player.hand,
		cardsCalled.map( getCardString )
	) );

	await Promise.all( playersWithCardsCalled.map( player => ctx.prisma.litPlayer.update( {
		where: { id: player.id },
		data: { hand: { set: removeIfPresent( player.hand, cardsCalled.map( getCardString ) ) } }
	} ) ) );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ moveData ] } }
	} );

	return { data: updatedGame };
};