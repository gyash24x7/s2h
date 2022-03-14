import type { Describe, Infer } from "superstruct";
import * as s from "superstruct";
import { CARD_RANKS, CARD_SUITS, CardRank, CardSuit } from "@s2h/utils";

export const gameCardStruct: Describe<{ rank: CardRank, suit: CardSuit }> = s.object( {
	rank: s.enums( CARD_RANKS ),
	suit: s.enums( CARD_SUITS )
} );

export const askCardInputStruct = s.object( {
	gameId: s.nonempty( s.string() ),
	askedFor: gameCardStruct,
	askedFrom: s.nonempty( s.string() )
} );

export type AskCardInput = Infer<typeof askCardInputStruct>;

export const callSetInputStruct = s.object( {
	gameId: s.nonempty( s.string() ),
	data: s.record( s.string(), s.array( gameCardStruct ) )
} );

export type CallSetInput = Infer<typeof callSetInputStruct>;

export const createGameInputStruct = s.object( {
	playerCount: s.integer()
} );

export type CreateGameInput = Infer<typeof createGameInputStruct>;

export const createTeamsInputStruct = s.object( {
	teams: s.size( s.array( s.nonempty( s.string() ) ), 2 ),
	gameId: s.nonempty( s.string() )
} );

export type CreateTeamsInput = Infer<typeof createTeamsInputStruct>;

export const declineCardInputStruct = s.object( {
	gameId: s.nonempty( s.string() ),
	cardDeclined: gameCardStruct
} );

export type DeclineCardInput = Infer<typeof declineCardInputStruct>;

export const getGameInputStruct = s.object( {
	gameId: s.nonempty( s.string() )
} );

export type GetGameInput = Infer<typeof getGameInputStruct>;

export const giveCardInputStruct = s.object( {
	gameId: s.nonempty( s.string() ),
	cardToGive: gameCardStruct,
	giveTo: s.nonempty( s.string() )
} );

export type GiveCardInput = Infer<typeof giveCardInputStruct>;

export const joinGameInputStruct = s.object( {
	code: s.size( s.nonempty( s.string() ), 7 )
} );

export type JoinGameInput = Infer<typeof joinGameInputStruct>;

export const startGameInputStruct = getGameInputStruct;

export type StartGameInput = Infer<typeof startGameInputStruct>;

export const transferTurnInputStruct = getGameInputStruct;

export type TransferTurnInput = Infer<typeof transferTurnInputStruct>;