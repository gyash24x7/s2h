import { LitMove, LitMoveType, LitPlayer } from "@prisma/client";
import { CardSet, getCardStringSentence } from "./card-utils";

export function getMoveDescription( players: LitPlayer[], move?: LitMove, lastMove?: LitMove ) {
	let turnPlayer: LitPlayer;
	let askedFromPlayer: LitPlayer;
	let callingPlayer: LitPlayer;
	let askingPlayer: LitPlayer;
	let card: string;
	let callingSet: string;

	if ( !move?.type ) {
		return "";
	}

	switch ( move.type ) {
		case LitMoveType.ASK:
			askingPlayer = players.find( player => player.id === move.askedById )!;
			askedFromPlayer = players.find( player => player.id === move.askedFromId )!;
			card = getCardStringSentence( move.askedFor! );
			return `${ askingPlayer.name } asked for ${ card } from ${ askedFromPlayer.name }`;

		case LitMoveType.TURN:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			return `Waiting for ${ turnPlayer.name } to Ask or Call`;

		case LitMoveType.GIVEN:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			askedFromPlayer = players.find( player => player.id === lastMove?.askedFromId )!;
			card = getCardStringSentence( lastMove?.askedFor! );
			return `${ askedFromPlayer.name } gave ${ card } to ${ turnPlayer.name }`;

		case LitMoveType.DECLINED:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			askingPlayer = players.find( player => player.id === lastMove?.askedById )!;
			card = getCardStringSentence( lastMove?.askedFor! );
			return `${ turnPlayer.name } declined ${ askingPlayer.name }'s ask for ${ card }`;

		case LitMoveType.CALL:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			callingSet = getCardStringSentence( move.callingSet! as CardSet );
			return `${ turnPlayer.name } is calling ${ callingSet }`;

		case LitMoveType.CALL_SUCCESS:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			callingSet = lastMove?.callingSet!;
			return `${ turnPlayer.name } called ${ callingSet } correctly`;

		case LitMoveType.CALL_FAIL:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			callingPlayer = players.find( player => player.id === lastMove?.turnId )!;
			callingSet = lastMove?.callingSet!;
			return `${ callingPlayer.name } called ${ callingSet } incorrectly. ${ turnPlayer.name }'s turn`;
	}
}