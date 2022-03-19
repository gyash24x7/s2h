import React from "react";
import { HStack, VStack } from "@s2h/ui/stack";
import { useGame } from "../utils/game-context";
import { Avatar } from "@s2h/ui/avatar";
import { CardHand } from "@s2h/utils";

export function DisplayTeams() {
	const { game } = useGame();

	return (
		<VStack className={ "divide-light-700 divide-dashed divide-y" }>
			{ game.teams.map( ( team ) => (
				<table className={ "min-w-full my-2" } key={ team.id }>
					<thead>
					<tr className={ "border-b border-dashed border-light-700" }>
						<th>
							<h2 className={ "font-semibold text-xl text-left pb-2" }>Team { team.name }</h2>
						</th>
						<th>
							<h2 className={ "font-semibold text-xl text-right pb-2" }>{ team.score }</h2>
						</th>
					</tr>
					</thead>
					<tbody>
					{ game.players.filter( player => player.teamId === team.id ).map( player => (
						<tr key={ player.id }>
							<td className={ "py-2" }>
								<HStack>
									<Avatar size={ "xs" } name={ player.name } src={ player.avatar }/>
									<h4 className={ "text-base" }>{ player.name }</h4>
								</HStack>
							</td>
							<td className={ "w-28" }>
								<h4 className={ "text-base text-right" }>
									{ CardHand.from( player.hand ).length() } Cards
								</h4>
							</td>
						</tr>
					) ) }
					</tbody>
				</table>
			) ) }
		</VStack>
	);
}