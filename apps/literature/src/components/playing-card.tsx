import type { GameCard } from "@s2h/utils";
import { getCardId, Rank, Suit } from "@s2h/utils";
import Spades from "../assets/suits/spades.png";
import Clubs from "../assets/suits/clubs.png";
import Diamonds from "../assets/suits/diamonds.png";
import Hearts from "../assets/suits/hearts.png";
import React from "react";
import { Stack } from "@s2h/ui/stack";

export interface PlayingCardProps {
	card: GameCard;
}

export const suitSrcMap: Record<Suit, string> = {
	CLUBS: Clubs,
	SPADES: Spades,
	HEARTS: Hearts,
	DIAMONDS: Diamonds
};

export const rankTextMap: Record<Rank, string> = {
	ACE: "A", TWO: "2", TEN: "10", THREE: "3", FIVE: "5", FOUR: "4", SEVEN: "7", SIX: "6",
	EIGHT: "8", NINE: "9", JACK: "J", QUEEN: "Q", KING: "K"
};

export function PlayingCard( { card }: PlayingCardProps ) {

	const colorClass = card.suit === Suit.SPADES || card.suit === Suit.CLUBS ? "text-dark-700" : "text-danger";

	return (
		<Stack
			orientation={ "vertical" }
			align={ "center" }
			className={ "py-3 px-6 border border-light-700 rounded rounded-lg m-2 bg-light-100" }
			spacing={ "xs" }
		>
			<h2 className={ `font-fjalla text-6xl ${ colorClass }` }>{ rankTextMap[ card.rank ] }</h2>
			<img src={ suitSrcMap[ card.suit ] } alt={ getCardId( card ) } width={ 50 } height={ 68 }/>;
		</Stack>
	);

}