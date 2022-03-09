import React from "react";
import { HStack, VStack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import type { LitGameData } from "@s2h/utils";
import { Card } from "@s2h/ui/card";

export interface PlayerLobbyProps {
	game: LitGameData;
}

export const PlayerLobby = function ( { game }: PlayerLobbyProps ) {
	return (
		<VStack>
			<Card
				title={ "Players Joined" }
				content={ (
					<div className={ "py-4" }>
						<HStack wrap>
							{ game.players.map( player => (
								<PlayerCard player={ player } key={ player.id }/>
							) ) }
						</HStack>
					</div>
				) }
			/>
		</VStack>
	);
};