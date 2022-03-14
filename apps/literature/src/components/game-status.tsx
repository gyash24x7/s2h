import { Card } from "@s2h/ui/card";
import React, { Fragment } from "react";
import { Flex } from "@s2h/ui/flex";
import { useGame } from "../utils/game-context";
import { HStack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import { PreviousMoves } from "./previous-moves";
import { AskCard } from "./ask-card";
import { LitMoveType } from "@prisma/client";
import { GiveCard } from "./give-card";
import { DeclineCard } from "./decline-card";
import { CreateTeams } from "./create-teams";
import { StartGame } from "./start-game";
import { CallSet } from "./call-set";
import { CardHand, GameCard } from "@s2h/utils";
import { TransferTurn } from "./transfer-turn";

export function GameStatus() {
	const { game, currentMove, mePlayer } = useGame();
	const myHand = CardHand.from( mePlayer.hand );

	const hasAskedCard = () => {
		if ( !currentMove ) {
			return false;
		}
		return myHand.contains( GameCard.from( currentMove.askedFor ) );
	};

	const getCurrentMovePlayer = () => {
		if ( !currentMove ) {
			return;
		}

		switch ( currentMove.type ) {
			case "ASK":
				return game.players.find( player => player.id === currentMove.askedFromId );
			default:
				return game.players.find( player => player.id === currentMove.turnId );
		}
	};

	return (
		<Card content={
			<Flex
				justify={ game.status === "IN_PROGRESS" ? "space-between" : "center" }
				align={ "center" }
			>
				{ game.status === "IN_PROGRESS" && (
					<HStack>
						<h2 className={ "font-fjalla text-3xl text-dark-700" }>TURN:</h2>
						<PlayerCard player={ getCurrentMovePlayer() || mePlayer } size={ "md" }/>
					</HStack>
				) }
				<HStack centered>
					{ game.status === "IN_PROGRESS" && <PreviousMoves/> }
					{ game.status === "PLAYERS_READY" && <CreateTeams/> }
					{ game.status === "TEAMS_CREATED" && <StartGame/> }
					{ currentMove?.turnId === mePlayer?.id && (
						<Fragment>
							{ myHand.length() > 0
								? (
									<HStack>
										<AskCard/>
										<CallSet/>
									</HStack>
								)
								: <TransferTurn/>
							}
						</Fragment>
					) }
					{ currentMove?.type === LitMoveType.ASK && currentMove?.askedFromId === mePlayer?.id && (
						<Fragment>{ hasAskedCard() ? <GiveCard/> : <DeclineCard/> }</Fragment>
					) }
				</HStack>
			</Flex>
		}/>
	);
}