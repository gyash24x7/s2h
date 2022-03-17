import React, { Fragment } from "react";
import { HStack, VStack } from "@s2h/ui/stack";
import { useGame } from "../utils/game-context";
import { Avatar } from "@s2h/ui/avatar";
import { CardHand } from "@s2h/utils";

export function DisplayTeams() {
	const { game } = useGame();

	return (
		<Fragment>
			<VStack>
				{ game.teams.map( ( team ) => (
					<table className={ "min-w-full my-2" } key={ team.id }>
						<thead>
						<tr>
							<th colSpan={ 2 }>
								<h4 className={ "font-semibold text-lg text-left" }>Team { team.name }</h4>
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
		</Fragment>
	);
}