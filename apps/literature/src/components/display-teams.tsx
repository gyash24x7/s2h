import React from "react";
import type { LitGameData } from "@s2h/utils";
import { Stack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";

export interface DisplayTeamsProps {
	game: LitGameData;
}

export const DisplayTeams = function ( { game }: DisplayTeamsProps ) {
	return (
		<Stack className={ "w-full" }>
			{ game.teams.map( team => (
				<div className={ "bg-light-300 rounded-md p-5 flex-1 border border-light-700" } key={ team.id }>
					<h2 className={ "text-xl mb-2 font-semibold" }>Team { team.name }</h2>
					<Stack className={ "flex-wrap" }>
						{ game.players.filter( player => player.teamId === team.id ).map( player => (
							<PlayerCard player={ player } key={ player.id }/>
						) ) }
					</Stack>
				</div>
			) ) }
		</Stack>
	);
};