import React from "react";
import { HStack } from "@s2h/ui/stack";
import { useGame } from "../utils/game-context";
import { Avatar } from "@s2h/ui/avatar";

export function PlayerLobby() {
	const { game } = useGame();
	return (
		<table className={ "min-w-full my-2" }>
			<thead>
			<tr>
				<th>
					<h4 className={ "font-semibold text-lg text-left" }>Players Joined</h4>
				</th>
			</tr>
			</thead>
			<tbody>
			{ game.players.map( player => (
				<tr key={ player.id }>
					<td className={ "py-2" }>
						<HStack>
							<Avatar size={ "xs" } name={ player.name } src={ player.avatar }/>
							<h4 className={ "text-base" }>{ player.name }</h4>
						</HStack>
					</td>
				</tr>
			) ) }
			</tbody>
		</table>
	);
}