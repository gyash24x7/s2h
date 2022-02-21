import { shuffle, splitArray } from "./array-utils";

export enum Rank {
	ACE = "ACE",
	TWO = "TWO",
	THREE = "THREE",
	FOUR = "FOUR",
	FIVE = "FIVE",
	SIX = "SIX",
	SEVEN = "SEVEN",
	EIGHT = "EIGHT",
	NINE = "NINE",
	TEN = "TEN",
	JACK = "JACK",
	QUEEN = "QUEEN",
	KING = "KING"
}

export const RANKS = [
	Rank.ACE,
	Rank.TWO,
	Rank.THREE,
	Rank.FOUR,
	Rank.FIVE,
	Rank.SIX,
	Rank.SEVEN,
	Rank.EIGHT,
	Rank.NINE,
	Rank.TEN,
	Rank.JACK,
	Rank.QUEEN,
	Rank.KING
] as const;

export enum Suit {
	HEARTS = "HEARTS",
	CLUBS = "CLUBS",
	SPADES = "SPADES",
	DIAMONDS = "DIAMONDS"
}

export const SUITS = [ Suit.HEARTS, Suit.CLUBS, Suit.DIAMONDS, Suit.SPADES ] as const;

export enum CardSet {
	SMALL_DIAMONDS = "SMALL_DIAMONDS",
	BIG_DIAMONDS = "BIG_DIAMONDS",
	SMALL_HEARTS = "SMALL_HEARTS",
	BIG_HEARTS = "BIG_HEARTS",
	SMALL_SPADES = "SMALL_SPADES",
	BIG_SPADES = "BIG_SPADES",
	SMALL_CLUBS = "SMALL_CLUBS",
	BIG_CLUBS = "BIG_CLUBS"
}

export const CARD_SETS = [
	CardSet.BIG_DIAMONDS,
	CardSet.BIG_CLUBS,
	CardSet.BIG_SPADES,
	CardSet.BIG_HEARTS,
	CardSet.SMALL_CLUBS,
	CardSet.SMALL_DIAMONDS,
	CardSet.SMALL_SPADES,
	CardSet.SMALL_HEARTS
] as const;

export type GameCard = {
	rank: Rank;
	suit: Suit;
}

export function getCardString( card: GameCard ) {
	return card.rank + " OF " + card.suit;
}

export class Deck {
	cards: GameCard[] = [];

	constructor() {
		this.cards = shuffle( SORTED_DECK );
	}

	static handContains( hand: GameCard[], card: GameCard ) {
		const foundCard = hand.find(
			( { rank, suit } ) => card.rank === rank && card.suit === suit
		);
		return !!foundCard;
	}

	static sortHand( hand: GameCard[] ) {
		let sortedHand: GameCard[] = [];
		SORTED_DECK.forEach( ( card ) => {
			if ( Deck.handContains( hand, card ) ) {
				sortedHand.push( card );
			}
		} );
		return sortedHand;
	}

	removeCardsOfRank( rank: Rank ) {
		this.cards = this.cards.filter( ( card ) => card.rank !== rank );
		return this;
	}

	generateHands( handCount: number ) {
		const handSize = this.cards.length / handCount;
		return [ ...Array( handCount ) ].map( ( _, i ) =>
			this.cards.slice(
				handSize * i,
				handSize * (
					i + 1
				)
			)
		);
	}
}

export const SORTED_DECK: GameCard[] = SUITS.flatMap( ( suit ) =>
	RANKS.map( ( rank ) => (
		{ rank, suit }
	) )
);

export const cardSuitMap: Record<Suit, GameCard[]> = {
	CLUBS: SORTED_DECK.filter( card => card.suit === Suit.CLUBS ),
	SPADES: SORTED_DECK.filter( card => card.suit === Suit.SPADES ),
	HEARTS: SORTED_DECK.filter( card => card.suit === Suit.HEARTS ),
	DIAMONDS: SORTED_DECK.filter( card => card.suit === Suit.DIAMONDS )
};

export const cardSetMap: Record<CardSet, GameCard[]> = {
	SMALL_CLUBS: splitArray( cardSuitMap.CLUBS.splice( 6, 1 ) )[ 0 ],
	SMALL_SPADES: splitArray( cardSuitMap.SPADES.splice( 6, 1 ) )[ 0 ],
	SMALL_DIAMONDS: splitArray( cardSuitMap.DIAMONDS.splice( 6, 1 ) )[ 0 ],
	SMALL_HEARTS: splitArray( cardSuitMap.HEARTS.splice( 6, 1 ) )[ 0 ],
	BIG_CLUBS: splitArray( cardSuitMap.CLUBS.splice( 6, 1 ) )[ 1 ],
	BIG_SPADES: splitArray( cardSuitMap.SPADES.splice( 6, 1 ) )[ 1 ],
	BIG_DIAMONDS: splitArray( cardSuitMap.DIAMONDS.splice( 6, 1 ) )[ 1 ],
	BIG_HEARTS: splitArray( cardSuitMap.HEARTS.splice( 6, 1 ) )[ 1 ]
};

export function getCardSet( card: GameCard ): CardSet {
	return CardSet[ (
		RANKS.indexOf( card.rank ) < 6 ? "SMALL_" : "BIG_" + card.suit.toString()
	) as keyof typeof CardSet ];

}