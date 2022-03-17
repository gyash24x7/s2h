import { Flex } from "@s2h/ui/flex";
import React from "react";
import { useGame } from "../utils/game-context";
import { DuplicateIcon } from "@heroicons/react/outline";

export const GameDescription = function () {
	const { game } = useGame();
	return (
		<div className={ "my-2" }>
			<p>Game Code</p>
			<Flex justify={ "space-between" } align={ "center" } className={ "w-full" }>
				<h1 className={ "text-6xl font-fjalla" }>{ game.code }</h1>
				<DuplicateIcon width={ 40 } height={ 40 }/>
			</Flex>
		</div>
	);
};