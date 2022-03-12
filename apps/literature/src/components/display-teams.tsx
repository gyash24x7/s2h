import React from "react";
import { HStack } from "@s2h/ui/stack";
import { useGame } from "../utils/game-context";
import { Card } from "@s2h/ui/card";
import { Avatar } from "@s2h/ui/avatar";
import { Flex } from "@s2h/ui/flex";

export function DisplayTeams() {
	const { game } = useGame();

	return (
		<Card content={
			<Flex justify={ "center" } align={ "center" }>
				<HStack>
					{ game.players.filter( player => player.teamId === game.teams[ 0 ].id ).map( player => (
						<Avatar src={ player.avatar } key={ player.id } size={ "lg" }/>
					) ) }
				</HStack>
				<Flex className={ "flex-1" } justify={ "center" } align={ "center" }>
					<h2 className={ "font-fjalla text-3xl text-right pr-8" }>{ game.teams[ 0 ].name }</h2>
					<h2 className={ "font-fjalla text-3xl" }>{ game.teams[ 0 ].score }</h2>
					<h2 className={ "font-fjalla text-3xl" }>-</h2>
					<h2 className={ "font-fjalla text-3xl" }>{ game.teams[ 1 ].score }</h2>
					<h2 className={ "font-fjalla text-3xl text-left pl-8" }>{ game.teams[ 1 ].name }</h2>
				</Flex>
				<HStack>
					{ game.players.filter( player => player.teamId === game.teams[ 1 ].id ).map( player => (
						<Avatar src={ player.avatar } key={ player.id } size={ "lg" }/>
					) ) }
				</HStack>
			</Flex>
		}/>
	);
}