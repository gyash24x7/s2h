import { Button } from "@s2h/ui/button";
import React from "react";
import { useGame } from "../utils/game-context";
import { trpc } from "../utils/trpc";

export function TransferTurn() {
	const { game } = useGame();
	const { mutateAsync, isLoading } = trpc.useMutation( "transfer-turn" );

	const transferTurn = () => mutateAsync( { gameId: game.id } );

	return (
		<Button
			buttonText={ "Transfer Turn" }
			appearance={ "success" }
			fullWidth
			isLoading={ isLoading }
			onClick={ transferTurn }
		/>
	);
}