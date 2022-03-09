import type { GameCard } from "@s2h/utils";
import { CardSet, getCardId, Rank, Suit } from "@s2h/utils";
import Spades from "../assets/suits/spades.png";
import Clubs from "../assets/suits/clubs.png";
import Diamonds from "../assets/suits/diamonds.png";
import Hearts from "../assets/suits/hearts.png";
import React from "react";
import { VStack } from "@s2h/ui/stack";

export interface PlayingCardProps {
	card: GameCard;
}

export const suitSrcMap: Record<Suit, string> = {
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

export const rankTextMap: Record<Rank, string> = {
	ACE: "A", TWO: "2", TEN: "10", THREE: "3", FIVE: "5", FOUR: "4", SEVEN: "7", SIX: "6",
	EIGHT: "8", NINE: "9", JACK: "J", QUEEN: "Q", KING: "K"
};

export function PlayingCard( { card }: PlayingCardProps ) {

	const colorClass = card.suit === Suit.SPADES || card.suit === Suit.CLUBS ? "text-dark-700" : "text-danger";

	return (
		<div className={ "border border-light-700 rounded rounded-lg bg-light-100 h-36 w-24 p-3" }>
			<VStack spacing={ "xs" } centered>
				<h2 className={ `font-fjalla text-6xl ${ colorClass }` }>{ rankTextMap[ card.rank ] }</h2>
				<img src={ suitSrcMap[ card.suit ] } alt={ getCardId( card ) } width={ 50 } height={ 50 }/>;
			</VStack>
		</div>
	);

}