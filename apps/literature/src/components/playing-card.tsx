import type { GameCard } from "@s2h/utils";
import { CardRank, CardSet, CardSuit } from "@s2h/utils";
import Spades from "../assets/suits/spades.png";
import Clubs from "../assets/suits/clubs.png";
import Diamonds from "../assets/suits/diamonds.png";
import Hearts from "../assets/suits/hearts.png";
import React from "react";

export interface PlayingCardProps {
	card: GameCard;
}

export const suitSrcMap: Record<CardSuit, string> = {
	CLUBS: Clubs,
	SPADES: Spades,
	HEARTS: Hearts,
	DIAMONDS: Diamonds
};

export const cardSetSrcMap: Record<CardSet, string> = {
	BIG_CLUBS: Clubs,
	BIG_DIAMONDS: Diamonds,
	BIG_HEARTS: Hearts,
	BIG_SPADES: Spades,
	SMALL_CLUBS: Clubs,
	SMALL_DIAMONDS: Diamonds,
	SMALL_HEARTS: Hearts,
	SMALL_SPADES: Spades
};

export const rankTextMap: Record<CardRank, string> = {
	ACE: "A", TWO: "2", TEN: "10", THREE: "3", FIVE: "5", FOUR: "4", SEVEN: "7", SIX: "6",
	EIGHT: "8", NINE: "9", JACK: "J", QUEEN: "Q", KING: "K"
};

export function PlayingCard( { card }: PlayingCardProps ) {

	const colorClass = card.suit === CardSuit.SPADES || card.suit === CardSuit.CLUBS ? "text-dark-700" : "text-danger";

	return (
		<div className={ "border border-light-700 rounded rounded-lg bg-light-100 h-24 w-16 pl-2 pt-1m king-yna-bg" }>
			<h2 className={ `font-fjalla text-3xl ${ colorClass }` }>{ rankTextMap[ card.rank ] }</h2>
			<img src={ suitSrcMap[ card.suit ] } alt={ card.getCardId() } width={ 16 } height={ 16 }/>
		</div>
	);

}