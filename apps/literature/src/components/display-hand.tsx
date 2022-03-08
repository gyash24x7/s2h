import React from "react";
import type { LitGameData } from "@s2h/utils";
import { getCardString, getGameCard, SORTED_DECK } from "@s2h/utils";
import { useAuth } from "../utils/auth";
import { Flex } from "@s2h/ui/flex";
import { PlayingCard } from "./playing-card";

export interface DisplayHandProps {
	game: LitGameData;
}


export const DisplayHand = function ( { game }: DisplayHandProps ) {
	const { user } = useAuth();
	const player = game.players.find( player => player.userId === user!.id )!;

	return (
		<div className={ "bg-light-200 rounded-md p-5 w-full border border-light-700" }>
			<h2 className={ "text-xl mb-2 font-semibold" }>Your Hand</h2>
			<Flex className={ "flex-wrap -mx-2" }>
				{ SORTED_DECK
					.map( getCardString )
					.filter( card => player.hand.includes( card ) )
					.map( getGameCard )
					.map( card => (
						<PlayingCard card={ card } key={ getCardString( card ) }/>
					) ) }
			</Flex>
		</div>
	);
};