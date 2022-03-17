import React from "react";
import { CardHand } from "@s2h/utils";
import { PlayingCard } from "./playing-card";
import { useGame } from "../utils/game-context";
import { HStack } from "@s2h/ui/stack";


export const DisplayHand = function () {
	const { mePlayer } = useGame();

	return (
		<div className={ "w-full" }>
			<h3 className={ "text-xl mb-2 font-semibold" }>Your Hand</h3>
			<HStack wrap spacing={ "sm" } stackItemClassName={ "my-2" }>
				{ CardHand.from( mePlayer.hand ).sorted().map( card => (
					<PlayingCard card={ card } key={ card.getCardId() }/>
				) ) }
			</HStack>
		</div>
	);
};