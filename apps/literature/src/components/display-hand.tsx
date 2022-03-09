import React from "react";
import { getCardString, SORTED_DECK } from "@s2h/utils";
import { PlayingCard } from "./playing-card";
import { useGame } from "../utils/game-context";
import { HStack } from "@s2h/ui/stack";
import { Card } from "@s2h/ui/card";


export const DisplayHand = function () {
	const { mePlayer } = useGame();

	return (
		<Card
			title={ "Your Hand" }
			content={ (
				<HStack wrap spacing={ "sm" } stackItemClassName={ "my-2" }>
					{
						SORTED_DECK
							.filter( card => mePlayer.hand.includes( getCardString( card ) ) )
							.map( card => (
								<PlayingCard card={ card } key={ getCardString( card ) }/>
							) )
					}
				</HStack>
			) }
		/>
	);
};