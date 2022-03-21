import React from "react";
import { CardHand, getCardId } from "@s2h/utils";
import { DisplayCard } from "./display-card";
import { useGame } from "../utils/game-context";
import { HStack } from "@s2h/ui/stack";


export const DisplayHand = function () {
	const { mePlayer } = useGame();

	return (
		<div className={ "w-full py-4 lg:py-0" }>
			<h3 className={ "text-xl mb-2 font-semibold" }>Your Hand</h3>
			<HStack wrap spacing={ "sm" } stackItemClassName={ "my-2" }>
				{ CardHand.from( mePlayer.hand ).sorted().map( card => (
					<DisplayCard card={ card } key={ getCardId( card ) }/>
				) ) }
			</HStack>
		</div>
	);
};