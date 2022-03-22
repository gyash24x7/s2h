import type { LitResolver } from "@s2h/utils";
import { CardHand, getCardSet, includesAll, Messages } from "@s2h/utils";
import { LitGame, LitMoveType, LitPlayer, LitTeam, Prisma } from "@prisma/client";
import type { CallSetInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

const callSetResolver: LitResolver<CallSetInput> = async ( { input, ctx } ) => {
	const game: LitGame = ctx.res?.locals.currentGame;
	const loggedInPlayer: LitPlayer = ctx.res?.locals.loggedInPlayer;

	const cardsCalled = Object.values( input.data ).flat();
	const cardSets = Array.from( new Set( cardsCalled.map( getCardSet ) ) );

	if ( cardSets.length !== 1 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_CARDS_OF_SAME_SET } );
	}

	if ( cardsCalled.length !== 6 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_ALL_CARDS } );
	}

	const myTeamPlayers = game.players.filter( player => player.teamId === loggedInPlayer.teamId );
	const otherTeamPlayers = game.players.filter( player => player.teamId !== loggedInPlayer.teamId );
	const otherTeamId = otherTeamPlayers[ 0 ]!.teamId!;

	if ( !includesAll( myTeamPlayers.map( player => player.id ), Object.keys( input.data ) ) ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.CALL_WITHIN_YOUR_TEAM } );
	}

	const moveData: Prisma.LitMoveCreateInput[] = [
		{ type: LitMoveType.CALL, callingSet: cardSets[ 0 ], turnId: loggedInPlayer.id }
	];

	let cardsCalledCorrect = 0;
	myTeamPlayers.forEach( ( { id, hand } ) => {
		const cardsCalledForPlayer = input.data[ id ];
		if ( !!cardsCalledForPlayer ) {
			if ( CardHand.from( hand ).containsAll( cardsCalledForPlayer ) ) {
				cardsCalledCorrect += cardsCalledForPlayer.length;
			}
		}
	} );

	const teamData: Record<string, LitTeam> = {};
	game.teams.forEach( team => {
		teamData[ team.id ] = team;
	} );

	const playerData: Record<string, LitPlayer> = {};
	game.players.forEach( player => {
		playerData[ player.id ] = player;
	} );

	if ( cardsCalledCorrect === 6 ) {
		teamData[ loggedInPlayer.teamId! ].score = teamData[ loggedInPlayer.teamId! ].score + 1;
		moveData.push( { type: LitMoveType.CALL_SUCCESS, turnId: loggedInPlayer.id } );
	} else {
		teamData[ otherTeamId ].score = teamData[ otherTeamId ].score + 1;
		moveData.push( { type: LitMoveType.CALL_FAIL, turnId: otherTeamPlayers[ 0 ].id } );
	}

	game.players
		.map( player => (
			{ ...player, cardHand: CardHand.from( player.hand ) }
		) )
		.filter( player => player.cardHand.containsSome( cardsCalled ) )
		.forEach( player => {
			player.cardHand.removeCardsOfSet( cardSets[ 0 ] );
			playerData[ player.id ].hand = player.cardHand.cards;
		} );

	const updatedGame = await ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: { push: moveData },
			teams: { set: Object.values( teamData ) },
			players: { set: Object.values( playerData ) }
		}
	} );

	ctx.namespace?.emit( game.id, updatedGame );
	return updatedGame;
};

export default callSetResolver;