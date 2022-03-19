import React, { Fragment } from "react";
import { useGame } from "../utils/game-context";
import { HStack, VStack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import { AskCard } from "./ask-card";
import { LitMoveType } from "@prisma/client";
import { GiveCard } from "./give-card";
import { DeclineCard } from "./decline-card";
import { CallSet } from "./call-set";
import { CardHand, GameCard } from "@s2h/utils";
import { TransferTurn } from "./transfer-turn";
import { PreviousMoves } from "./previous-moves";
import { Banner } from "@s2h/ui/banner";
import { getMoveDescription } from "@s2h/utils/literature-utils";

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
		<VStack className={ "w-full py-4 lg:py-0" } spacing={ "2xl" }>
			<Banner message={ getMoveDescription( game.players, game.moves[ 0 ], game.moves[ 1 ] ) }/>
			{ game.status === "IN_PROGRESS" && (
				<HStack>
					<h2 className={ "font-fjalla text-3xl text-dark-700" }>TURN:</h2>
					<PlayerCard player={ getCurrentMovePlayer() || mePlayer } size={ "md" }/>
				</HStack>
			) }
			<HStack>
				<PreviousMoves/>
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
		</VStack>
	);
}