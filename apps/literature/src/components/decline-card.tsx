import { Button } from "@s2h/ui/button";
import React from "react";
import { useGame } from "../utils/game-context";
import { trpc } from "../utils/trpc";
import { getGameCard } from "@s2h/utils";

export function DeclineCard() {
	const { game, currentMove } = useGame();
	const { mutateAsync, isLoading } = trpc.useMutation( "decline-card" );

	const declineCard = () => mutateAsync( {
		gameId: game.id,
		cardDeclined: getGameCard( currentMove?.askedFor! )
	} );

	return (
		<Button
			buttonText={ "Decline Card" }
			appearance={ "danger" }
			fullWidth
			isLoading={ isLoading }
			onClick={ declineCard }
		/>
	);
}