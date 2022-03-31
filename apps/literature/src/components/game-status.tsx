import React, { Fragment } from "react";
import { useGame } from "../utils/game-context";
import { HStack, VStack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import { AskCard } from "./ask-card";
import { LitMoveType } from "@prisma/client";
import { GiveCard } from "./give-card";
import { DeclineCard } from "./decline-card";
import { CallSet } from "./call-set";
import { TransferTurn } from "./transfer-turn";
import { PreviousMoves } from "./previous-moves";
import { Banner } from "@s2h/ui/banner";
import { getMoveDescription } from "@s2h/utils/literature-utils";

export function GameStatus() {
	const { status, loggedInPlayer, loggedInPlayerHand, players, moves } = useGame();

	const hasAskedCard = () => {
		if ( !moves[ 0 ] ) {
			return false;
		}
		return loggedInPlayerHand.contains( moves[ 0 ].askedFor! );
	};

	const getCurrentMovePlayer = () => {
		if ( !moves[ 0 ] ) {
			return;
		}

		switch ( moves[ 0 ].type ) {
			case "ASK":
				return players.find( player => player.id === moves[ 0 ].askedFromId );
			default:
				return players.find( player => player.id === moves[ 0 ].turnId );
		}
	};

	return (
		<VStack className={ "w-full py-4 lg:py-0" } spacing={ "2xl" }>
			<Banner message={ getMoveDescription( players, moves[ 0 ], moves[ 1 ] ) }/>
			{ status === "IN_PROGRESS" && (
				<HStack>
					<h2 className={ "font-fjalla text-3xl text-dark-700" }>TURN:</h2>
					<PlayerCard player={ getCurrentMovePlayer() || loggedInPlayer } size={ "md" }/>
				</HStack>
			) }
			<HStack>
				<PreviousMoves/>
				{ moves[ 0 ]?.turnId === loggedInPlayer?.id && (
					<Fragment>
						{ loggedInPlayerHand.length() > 0
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
				{ moves[ 0 ]?.type === LitMoveType.ASK && moves[ 0 ]?.askedFromId === loggedInPlayer?.id && (
					<Fragment>{ hasAskedCard() ? <GiveCard/> : <DeclineCard/> }</Fragment>
				) }
			</HStack>
		</VStack>
	);
}