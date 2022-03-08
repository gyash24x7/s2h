import * as trpc from "@trpc/server";
import type { TrpcContext } from "@s2h/utils";
import { createGameResolver } from "./create-game";
import { joinGameResolver } from "./join-game";
import { createTeamsResolver } from "./create-teams";
import { startGameResolver } from "./start-game";
import { askCardResolver } from "./ask-card";
import { giveCardResolver } from "./give-card";
import { declineCardResolver } from "./decline-card";
import { getGameResolver } from "./get-game";
import { callSetResolver } from "./call-set";
import { transferTurnResolver } from "./transfer-turn";
import {
	askCardInputStruct,
	callSetInputStruct,
	createGameInputStruct,
	createTeamsInputStruct,
	declineCardInputStruct,
	getGameInputStruct,
	giveCardInputStruct,
	joinGameInputStruct,
	startGameInputStruct,
	transferTurnInputStruct
} from "@s2h/dtos";
import { gameUpdateResolver } from "./game-update";

export const literatureRouter = trpc.router<TrpcContext>()
	.query( "get-game", { input: getGameInputStruct, resolve: getGameResolver } )
	.mutation( "transfer-turn", { input: transferTurnInputStruct, resolve: transferTurnResolver } )
	.mutation( "call-set", { input: callSetInputStruct, resolve: callSetResolver } )
	.mutation( "decline-card", { input: declineCardInputStruct, resolve: declineCardResolver } )
	.mutation( "give-card", { input: giveCardInputStruct, resolve: giveCardResolver } )
	.mutation( "ask-card", { input: askCardInputStruct, resolve: askCardResolver } )
	.mutation( "start-lit-game", { input: startGameInputStruct, resolve: startGameResolver } )
	.mutation( "create-lit-teams", { input: createTeamsInputStruct, resolve: createTeamsResolver } )
	.mutation( "join-lit-game", { input: joinGameInputStruct, resolve: joinGameResolver } )
	.mutation( "create-lit-game", { input: createGameInputStruct, resolve: createGameResolver } )
	.subscription( "lit-game", { input: getGameInputStruct, resolve: gameUpdateResolver } );

export type LiteratureRouter = typeof literatureRouter;