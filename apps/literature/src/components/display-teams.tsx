import React from "react";
import { HStack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import { useGame } from "../utils/game-context";
import { Card } from "@s2h/ui/card";

export const DisplayTeams = function () {
	const { game } = useGame();

	return (
		<HStack stackItemExpand spacing={ "sm" }>
			{ game.teams.map( team => (
				<Card
					key={ team.id }
					title={ `Team ${ team.name }` }
					content={ (
						<div className={ "py-4" }>
							<HStack wrap>
								{ game.players.filter( player => player.teamId === team.id ).map( player => (
									<PlayerCard player={ player } key={ player.id }/>
								) ) }
							</HStack>
						</div>
					)
					}/>
			) ) }
		</HStack>
	);
};