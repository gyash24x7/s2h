import * as trpc from "@trpc/server";
import { TrpcContext } from "@s2h/utils/trpc";
import { createGameInput, createGameResolver } from "./create-game";
import { joinGameInput, joinGameResolver } from "./join-game";
import { createTeamsInput, createTeamsResolver } from "./create-teams";
import { startGameInput, startGameResolver } from "./start-game";
import { askCardInput, askCardResolver } from "./ask-card";
import { giveCardInput, giveCardResolver } from "./give-card";
import { declineCardInput, declineCardResolver } from "./decline-card";
import { getGameInput, getGameResolver } from "./get-game";
import { LitGame } from "@s2h/prisma";
import { callSetInput, callSetResolver } from "./call-set";
import { transferTurnInput, transferTurnResolver } from "./transfer-turn";

export type GameResponse = { error?: string, data?: LitGame }

export const literatureRouter = trpc.router<TrpcContext>()
	.query( "get-game", { input: getGameInput, resolve: getGameResolver } )
	.mutation( "transfer-turn", { input: transferTurnInput, resolve: transferTurnResolver } )
	.mutation( "call-set", { input: callSetInput, resolve: callSetResolver } )
	.mutation( "decline-card", { input: declineCardInput, resolve: declineCardResolver } )
	.mutation( "give-card", { input: giveCardInput, resolve: giveCardResolver } )
	.mutation( "ask-card", { input: askCardInput, resolve: askCardResolver } )
	.mutation( "start-lit-game", { input: startGameInput, resolve: startGameResolver } )
	.mutation( "create-lit-teams", { input: createTeamsInput, resolve: createTeamsResolver } )
	.mutation( "join-lit-game", { input: joinGameInput, resolve: joinGameResolver } )
	.mutation( "create-lit-game", { input: createGameInput, resolve: createGameResolver } );