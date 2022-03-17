import { shuffle } from "./array-utils";
import { sentenceCase } from "change-case";
import type { Prisma } from "@prisma/client";

export enum CardRank {
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

export enum CardSuit {
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

export class GameCard {
	rank: CardRank;
	suit: CardSuit;

	constructor( rank: CardRank, suit: CardSuit ) {
		this.rank = rank;
		this.suit = suit;
	}

	static from( json: Prisma.JsonValue ) {
		json = json as Prisma.JsonObject;
		const rank = json[ "rank" ] as CardRank;
		const suit = json[ "suit" ] as CardSuit;
		return new GameCard( rank, suit );
	}

	static getCardId( rank: CardRank, suit: CardSuit ) {
		return rank + "_OF_" + suit;
	}

	getCardSet(): CardSet {
		const cardSetString = CARD_RANKS.indexOf( this.rank ) < 6 ? "SMALL_" + this.suit : "BIG_" + this.suit;
		return CardSet[ cardSetString as keyof typeof CardSet ];
	}

	getCardId() {
		return this.rank + "_OF_" + this.suit;
	}

	getCardString() {
		return sentenceCase( this.getCardId() );
	}

	equals( card: GameCard ) {
		return card.suit === this.suit && card.rank === this.rank;
	}

	serialize(): Prisma.JsonObject {
		return { rank: this.rank, suit: this.suit };
	}
}

export class CardHand {
	cards: GameCard[] = [];

	constructor( cards: GameCard[] ) {
		this.cards = cards;
	}

	static from( cards: Prisma.JsonValue ) {
		cards = cards as Prisma.JsonArray;
		return new CardHand( cards.map( card => GameCard.from( card as Prisma.JsonObject ) ) );
	}

	length() {
		return this.cards.length;
	}

	contains( card: GameCard ) {
		return !!this.cards.find( ( { rank, suit } ) => card.rank === rank && card.suit === suit );
	}

	containsAll( cards: GameCard[] ) {
		for ( const card of cards ) {
			if ( !this.contains( card ) ) {
				return false;
			}
		}
		return true;
	}

	containsSome( cards: GameCard[] ) {
		for ( const card of cards ) {
			if ( this.contains( card ) ) {
				return true;
			}
		}
		return false;
	}

	sorted() {
		let gameCards: GameCard[] = [];
		SORTED_DECK.forEach( ( card ) => {
			if ( this.contains( card ) ) {
				gameCards.push( card );
			}
		} );

		this.cards = gameCards;
		return this;
	}

	map<T>( fn: ( card: GameCard ) => T ): T[] {
		return this.cards.map( fn );
	}

	removeGameCard( card: GameCard ) {
		this.cards = this.cards.filter( ( { rank, suit } ) => card.rank !== rank || card.suit !== suit );
	}

	removeCardsOfSet( cardSet: CardSet ) {
		this.cards = this.cards.filter( card => card.getCardSet() !== cardSet );
	}

	addCard( ...card: GameCard[] ) {
		this.cards = [ ...this.cards, ...card ];
	}

	getCardSetsInHand() {
		const setOfCardSet = new Set<CardSet>();
		this.cards.forEach( card => setOfCardSet.add( card.getCardSet() ) );
		return Array.from( setOfCardSet );
	}

	getCardSuitsInHand() {
		const cardSuitSet = new Set<CardSuit>();
		this.cards.forEach( card => cardSuitSet.add( card.suit ) );
		return Array.from( cardSuitSet );
	}

	getCardsOfSet( set: CardSet ) {
		return cardSetMap[ set ].filter( card => this.contains( card ) );
	}

	serialize(): Prisma.JsonArray {
		return this.cards.map( card => (
			{ ...card }
		) );
	}
}

export class Deck {
	cards: GameCard[] = [];

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
			.map( cards => new CardHand( cards ) );
	}
}

export const SORTED_DECK: GameCard[] = CARD_SUITS.flatMap( (
	suit ) => CARD_RANKS.map( ( rank ) => new GameCard( rank, suit )
) );

export const cardSuitMap: Record<CardSuit, GameCard[]> = {
	CLUBS: SORTED_DECK.filter( card => card.suit === CardSuit.CLUBS ),
	SPADES: SORTED_DECK.filter( card => card.suit === CardSuit.SPADES ),
	HEARTS: SORTED_DECK.filter( card => card.suit === CardSuit.HEARTS ),
	DIAMONDS: SORTED_DECK.filter( card => card.suit === CardSuit.DIAMONDS )
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