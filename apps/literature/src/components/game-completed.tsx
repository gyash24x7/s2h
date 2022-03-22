import React from "react";
import { useGame } from "../utils/game-context";
import { Flex } from "@s2h/ui/flex";
import { CheckCircleIcon } from "@heroicons/react/solid";

export function GameCompleted() {
	const { game: { teams } } = useGame();

	return (
		<Flex direction={ "col" } justify={ "center" } align={ "center" } className={ "w-full h-full" }>
			<CheckCircleIcon className={ "text-success w-1/2 h-1/2" }/>
			<h2 className={ "font-fjalla text-success text-4xl my-2" }>Game Completed</h2>
			{ teams[ 0 ].score > teams[ 1 ].score && (
				<h2 className={ "font-fjalla text-success text-4xl my-2" }>Team { teams[ 0 ].name } Won!</h2>
			) }
			{ teams[ 1 ].score > teams[ 0 ].score && (
				<h2 className={ "font-fjalla text-success text-4xl my-2" }>Team { teams[ 1 ].name } Won!</h2>
			) }

			{ teams[ 1 ].score === teams[ 0 ].score && (
				<h2 className={ "font-fjalla text-success text-4xl my-2" }>Match Tied!</h2>
			) }
		</Flex>
	);
}