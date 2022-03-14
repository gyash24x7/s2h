import { Button } from "@s2h/ui/button";
import React from "react";
import { trpc } from "../utils/trpc";
import { useGame } from "../utils/game-context";
import { GameCard } from "@s2h/utils";

export function GiveCard() {
	const { game, currentMove } = useGame();
	const { mutateAsync, isLoading } = trpc.useMutation( "give-card" );

	const giveCard = () => mutateAsync( {
		gameId: game.id,
		cardToGive: GameCard.from( currentMove!.askedFor ),
		giveTo: currentMove?.askedById!
	} );

	return (
		<Button
			buttonText={ "Give Card" }
			appearance={ "success" }
			fullWidth
			isLoading={ isLoading }
			onClick={ giveCard }
		/>
	);
}