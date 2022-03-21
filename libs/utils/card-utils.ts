import { shuffle } from "./array-utils";
import { CardRank, CardSet, CardSuit, PlayingCard } from "@prisma/client";
import { sentenceCase } from "change-case";

export const CARD_RANKS = [
	CardRank.ACE,
	CardRank.TWO,
	CardRank.THREE,
	CardRank.FOUR,
	CardRank.FIVE,
	CardRank.SIX,
	CardRank.SEVEN,
	CardRank.EIGHT,
	CardRank.NINE,
	CardRank.TEN,
	CardRank.JACK,
	CardRank.QUEEN,
	CardRank.KING
] as const;

export const CARD_SUITS = [ CardSuit.HEARTS, CardSuit.CLUBS, CardSuit.DIAMONDS, CardSuit.SPADES ] as const;

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

export class CardHand {
	cards: PlayingCard[] = [];

	private constructor( cards: PlayingCard[] ) {
		this.cards = cards;
	}

	static from( cards: PlayingCard[] ) {
		return new CardHand( cards );
	}

	length() {
		return this.cards.length;
	}

	contains( card: PlayingCard ) {
		return !!this.cards.find( ( { rank, suit } ) => card.rank === rank && card.suit === suit );
	}

	containsAll( cards: PlayingCard[] ) {
		for ( const card of cards ) {
			if ( !this.contains( card ) ) {
				return false;
			}
		}
		return true;
	}

	containsSome( cards: PlayingCard[] ) {
		for ( const card of cards ) {
			if ( this.contains( card ) ) {
				return true;
			}
		}
		return false;
	}

	sorted() {
		let gameCards: PlayingCard[] = [];
		SORTED_DECK.forEach( ( card ) => {
			if ( this.contains( card ) ) {
				gameCards.push( card );
			}
		} );

		this.cards = gameCards;
		return this;
	}

	map<T>( fn: ( card: PlayingCard ) => T ): T[] {
		return this.cards.map( fn );
	}

	removeCard( card: PlayingCard ) {
		this.cards = this.cards.filter( ( { rank, suit } ) => card.rank !== rank || card.suit !== suit );
	}

	removeCardsOfSet( cardSet: CardSet ) {
		this.cards = this.cards.filter( card => getCardSet( card ) !== cardSet );
	}

	addCard( ...card: PlayingCard[] ) {
		this.cards = [ ...this.cards, ...card ];
	}

	getCardSetsInHand() {
		const setOfCardSet = new Set<CardSet>();
		this.cards.forEach( card => setOfCardSet.add( getCardSet( card ) ) );
		return Array.from( setOfCardSet );
	}

	getCardSuitsInHand() {
		const cardSuitSet = new Set<CardSuit>();
		this.cards.forEach( card => cardSuitSet.add( card.suit ) );
		return Array.from( cardSuitSet );
	}

	getCardsOfSet( set: CardSet ) {
		return this.cards.filter( card => getCardSet( card ) === set );
	}
}

export class Deck {
	cards: PlayingCard[] = [];

	constructor() {
		this.cards = shuffle( SORTED_DECK );
	}

	removeCardsOfRank( rank: CardRank ) {
		this.cards = this.cards.filter( ( card ) => card.rank !== rank );
		return this;
	}

	generateHands( handCount: number ) {
		const handSize = this.cards.length / handCount;
		return [ ...Array( handCount ) ]
			.map( ( _, i ) => this.cards.slice( handSize * i, handSize * i + handSize ) )
			.map( cards => CardHand.from( cards ) );
	}
}

export function getCardSet( { rank, suit }: PlayingCard ): CardSet {
	const cardSetString = CARD_RANKS.indexOf( rank ) < 6 ? "SMALL_" + suit : "BIG_" + suit;
	return CardSet[ cardSetString as keyof typeof CardSet ];
}

export function getCardString( { rank, suit }: PlayingCard ): string {
	return sentenceCase( rank ) + " of " + sentenceCase( suit );
}

export function getCardId( { rank, suit }: PlayingCard ): string {
	return `${ rank }_OF_${ suit }`;
}

export const SORTED_DECK: { rank: CardRank, suit: CardSuit }[] = CARD_SUITS.flatMap(
	suit => CARD_RANKS.map( rank => (
		{ rank, suit }
	) )
);

export const cardSuitMap: Record<CardSuit, PlayingCard[]> = {
	CLUBS: SORTED_DECK.filter( card => card.suit === CardSuit.CLUBS ),
	SPADES: SORTED_DECK.filter( card => card.suit === CardSuit.SPADES ),
	HEARTS: SORTED_DECK.filter( card => card.suit === CardSuit.HEARTS ),
	DIAMONDS: SORTED_DECK.filter( card => card.suit === CardSuit.DIAMONDS )
};

export const cardSetMap: Record<CardSet, PlayingCard[]> = {
	SMALL_CLUBS: cardSuitMap.CLUBS.slice( 0, 6 ),
	SMALL_SPADES: cardSuitMap.SPADES.slice( 0, 6 ),
	SMALL_DIAMONDS: cardSuitMap.DIAMONDS.slice( 0, 6 ),
	SMALL_HEARTS: cardSuitMap.HEARTS.slice( 0, 6 ),
	BIG_CLUBS: cardSuitMap.CLUBS.slice( 7 ),
	BIG_SPADES: cardSuitMap.SPADES.slice( 7 ),
	BIG_DIAMONDS: cardSuitMap.DIAMONDS.slice( 7 ),
	BIG_HEARTS: cardSuitMap.HEARTS.slice( 7 )
};