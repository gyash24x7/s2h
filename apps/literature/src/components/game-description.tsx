import { Flex } from "@s2h/ui/flex";
import React from "react";
import { useGame } from "../utils/game-context";

export const GameDescription = function () {
	const { game } = useGame();
	return (
		<Flex
			align={ "center" }
			direction={ "col" }
			className={ "bg-light-100 rounded-md p-5 w-full" }
		>
			<p>Game Code</p>
			<h1 className={ "text-8xl font-fjalla my-2" }>{ game.code }</h1>
			<p>Share game code with other players</p>
		</Flex>
	);
};