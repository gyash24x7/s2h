import { Flex } from "@s2h/ui/flex";
import React from "react";
import type { LitGameData } from "@s2h/utils";

export interface GameDescriptionProps {
	game: LitGameData;
}

export const GameDescription = function ( { game }: GameDescriptionProps ) {
	return (
		<Flex
			direction={ "col" }
			className={ "bg-light-300 rounded-md p-5 w-full border border-light-700" }
		>
			<p>Game Code</p>
			<h1 className={ "text-8xl font-fjalla my-2" }>{ game?.code }</h1>
			<p>Share game code with other players</p>
		</Flex>
	);
};