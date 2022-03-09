import { GameCard, Rank, Suit } from "./types";
import { shuffle } from "./array-utils";

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

export function getGameCard( cardString: string ): GameCard {
	return {
		rank: RANKS.find( rank => cardString.indexOf( rank ) > -1 )!,
		suit: SUITS.find( suit => cardString.indexOf( suit ) > -1 )!
	};
}

export function getCardString( card: GameCard ) {
	return card.rank + " OF " + card.suit;
}

export function getCardStringSentence( cardString: string ) {
	return getCardSentenceString( getGameCard( cardString ) );
}

export function getCardSentenceString( card: GameCard ) {
	const rank = card.rank[ 0 ].toUpperCase() + card.rank.substring( 1 ).toLowerCase();
	const suit = card.suit[ 0 ].toUpperCase() + card.suit.substring( 1 ).toLowerCase();

	return rank + " of " + suit;
}

export function getCardId( card: GameCard ) {
	return card.rank.toLowerCase() + "_" + card.suit.toLowerCase();
}

export function getCardSetsFromHand( hand: GameCard[] ): CardSet[] {
	const setOfCardSet = new Set<CardSet>();
	hand.forEach( card => setOfCardSet.add( getCardSet( card ) ) );
	return Array.from( setOfCardSet );
}

export function getCardSuitsFromHand( hand: GameCard[] ): Suit[] {
	const cardSuitSet = new Set<Suit>();
	hand.forEach( card => cardSuitSet.add( card.suit ) );
	return Array.from( cardSuitSet );
}

export function getNumberOfCardsOfSetInHand( hand: GameCard[], set: CardSet ) {
	return cardSetMap[ set ].filter( card => isCardInHand( hand, card ) ).length;
}

export function isCardInHand( hand: GameCard[], { rank, suit }: GameCard ) {
	const found = hand.find( card => card.rank === rank && card.suit === suit );
	return !!found;
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
	SMALL_CLUBS: cardSuitMap.CLUBS.slice( 0, 6 ),
	SMALL_SPADES: cardSuitMap.SPADES.slice( 0, 6 ),
	SMALL_DIAMONDS: cardSuitMap.DIAMONDS.slice( 0, 6 ),
	SMALL_HEARTS: cardSuitMap.HEARTS.slice( 0, 6 ),
	BIG_CLUBS: cardSuitMap.CLUBS.slice( 7 ),
	BIG_SPADES: cardSuitMap.SPADES.slice( 7 ),
	BIG_DIAMONDS: cardSuitMap.DIAMONDS.slice( 7 ),
	BIG_HEARTS: cardSuitMap.HEARTS.slice( 7 )
};

export function getCardSetSentenceString( cardSet: CardSet ) {
	const setType = cardSet.split( "_" )[ 0 ];
	const suit = cardSet.split( "_" )[ 1 ];
	return setType[ 0 ].toUpperCase()
		+ setType.slice( 1 ).toLowerCase()
		+ " "
		+ suit[ 0 ].toUpperCase()
		+ suit.slice( 1 ).toLowerCase();
}

export function getCardSet( card: GameCard ): CardSet {
	return CardSet[ (
		RANKS.indexOf( card.rank ) < 6 ? "SMALL_" + card.suit.toString() : "BIG_" + card.suit.toString()
	) as keyof typeof CardSet ];

}