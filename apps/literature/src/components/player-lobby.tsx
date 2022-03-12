import React from "react";
import { HStack, VStack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import { Card } from "@s2h/ui/card";
import { useGame } from "../utils/game-context";

export function PlayerLobby() {
	const { game } = useGame();
	return (
		<VStack>
			<Card
				centered
				title={ game.status === "NOT_STARTED" ? "Player Lobby" : game.status === "PLAYERS_READY"
					? "Players"
					: undefined }
				content={ (
					<div className={ "pt-4" }>
						<HStack wrap centered>
							{ game.players.map( player => (
								<PlayerCard player={ player } key={ player.id }/>
							) ) }
						</HStack>
					</div>
				) }
			/>
		</VStack>
	);
}