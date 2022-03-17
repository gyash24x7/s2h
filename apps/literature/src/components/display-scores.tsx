import React from "react";
import { useGame } from "../utils/game-context";
import { Flex } from "@s2h/ui/flex";

export function DisplayScores() {
	const { game } = useGame();

	return (
		<Flex className={ "flex-1 my-4" } justify={ "center" } align={ "center" }>
			<h2 className={ "font-fjalla text-3xl text-right pr-8" }>{ game.teams[ 0 ].name }</h2>
			<h2 className={ "font-fjalla text-3xl" }>{ game.teams[ 0 ].score }</h2>
			<h2 className={ "font-fjalla text-3xl" }>-</h2>
			<h2 className={ "font-fjalla text-3xl" }>{ game.teams[ 1 ].score }</h2>
			<h2 className={ "font-fjalla text-3xl text-left pl-8" }>{ game.teams[ 1 ].name }</h2>
		</Flex>
	);
}