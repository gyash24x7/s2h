import React from "react";
import { CardHand } from "@s2h/utils";
import { PlayingCard } from "./playing-card";
import { useGame } from "../utils/game-context";
import { HStack } from "@s2h/ui/stack";
import { Card } from "@s2h/ui/card";


export const DisplayHand = function () {
	const { mePlayer } = useGame();

	return (
		<Card
			centered
			title={ "Your Hand" }
			content={ (
				<HStack wrap spacing={ "sm" } stackItemClassName={ "my-2" } centered>
					{ CardHand.from( mePlayer.hand ).sorted().map( card => (
						<PlayingCard card={ card } key={ card.getCardId() }/>
					) ) }
				</HStack>
			) }
		/>
	);
};