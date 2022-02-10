import { z } from "zod";

export function shuffle<T>( array: T[] ) {
	let arr = [ ...array ];
	for ( let i = arr.length; i > 1; i-- ) {
		let j = Math.floor( Math.random() * i );
		[ arr[ i - 1 ], arr[ j ] ] = [ arr[ j ], arr[ i - 1 ] ];
	}
	return arr;
}

export function splitArray<T>( arr: T[] ) {
	return [ arr.slice( 0, arr.length / 2 ), arr.slice( arr.length / 2 ) ];
}

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

export enum Suit {
	HEARTS = "HEARTS",
	CLUBS = "CLUBS",
	SPADES = "SPADES",
	DIAMONDS = "DIAMONDS"
}

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

export const zodGameCard = z.object( {
	rank: z.nativeEnum( Rank ),
	suit: z.nativeEnum( Suit )
} );

export type GameCard = z.infer<typeof zodGameCard>

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

export const SUITS: Suit[] = [ Suit.HEARTS, Suit.SPADES, Suit.CLUBS, Suit.DIAMONDS ];

export const RANKS: Rank[] = [
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
];

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

export function includesAll<T>( arr: T[], subset: T[] ) {
	let flag = 0;
	subset.forEach( entry => {
		if ( arr.includes( entry ) ) {
			flag++;
		}
	} );
	return subset.length === flag;
}

export function includeSome<T>( arr: T[], subset: T[] ) {
	let flag = 0;
	subset.forEach( entry => {
		if ( arr.includes( entry ) ) {
			flag++;
		}
	} );

	return flag > 0;
}

export function removeIfPresent<T>( arr: T[], subset: T[] ) {
	const newArr: T[] = [];
	subset.forEach( entry => {
		if ( !arr.includes( entry ) ) {
			newArr.push( entry );
		}
	} );
	return newArr;
}