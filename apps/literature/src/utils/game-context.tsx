import type { LitGameData } from "@s2h/utils";
import { createContext, useContext } from "react";
import type { LitMove, LitPlayer, LitTeam } from "@prisma/client";

export interface IGameContext {
	game: LitGameData;
	mePlayer: LitPlayer;
	meTeam?: LitTeam;
	currentMove?: LitMove;
}

export const GameContext = createContext<IGameContext>( null! );

export const useGame = () => useContext<IGameContext>( GameContext );