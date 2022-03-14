import { LitMove, LitMoveType, LitPlayer, Prisma } from "@prisma/client";
import { sentenceCase } from "change-case";
import { GameCard } from "./card-utils";

export function getMoveDescription( players: LitPlayer[], move?: LitMove, lastMove?: LitMove ) {
	let turnPlayer: LitPlayer;
	let askedFromPlayer: LitPlayer;
	let callingPlayer: LitPlayer;
	let askingPlayer: LitPlayer;
	let card: GameCard;
	let callingSet: string;

	if ( !move?.type ) {
		return "";
	}

	switch ( move.type ) {
		case LitMoveType.ASK:
			askingPlayer = players.find( player => player.id === move.askedById )!;
			askedFromPlayer = players.find( player => player.id === move.askedFromId )!;
			card = GameCard.from( move.askedFor as Prisma.JsonObject );
			return `${ askingPlayer.name } asked for ${ card.getCardString() } from ${ askedFromPlayer.name }`;

		case LitMoveType.TURN:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			return `Waiting for ${ turnPlayer.name } to Ask or Call`;

		case LitMoveType.GIVEN:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			askedFromPlayer = players.find( player => player.id === lastMove?.askedFromId )!;
			card = GameCard.from( lastMove?.askedFor as Prisma.JsonObject );
			return `${ askedFromPlayer.name } gave ${ card.getCardString() } to ${ turnPlayer.name }`;

		case LitMoveType.DECLINED:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			askingPlayer = players.find( player => player.id === lastMove?.askedById )!;
			card = GameCard.from( lastMove?.askedFor as Prisma.JsonObject );
			return `${ turnPlayer.name } declined ${ askingPlayer.name }'s ask for ${ card.getCardString() }`;

		case LitMoveType.CALL:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			callingSet = sentenceCase( move.callingSet! );
			return `${ turnPlayer.name } is calling ${ callingSet }`;

		case LitMoveType.CALL_SUCCESS:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			callingSet = sentenceCase( lastMove?.callingSet! );
			return `${ turnPlayer.name } called ${ callingSet } correctly`;

		case LitMoveType.CALL_FAIL:
			turnPlayer = players.find( player => player.id === move.turnId )!;
			callingPlayer = players.find( player => player.id === lastMove?.turnId )!;
			callingSet = sentenceCase( lastMove?.callingSet! );
			return `${ callingPlayer.name } called ${ callingSet } incorrectly. ${ turnPlayer.name }'s turn`;
	}
}