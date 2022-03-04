import React from "react";
import { trpc } from "../utils/trpc";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@s2h/ui/button";

export const StartGame = function () {
	const params = useParams<{ gameId: string }>();
	const navigate = useNavigate();

	const { mutateAsync, isLoading } = trpc.useMutation( "start-lit-game", {
		async onSuccess( { id } ) {
			navigate( `/play/${ id }` );
		},
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	return (
		<Button
			buttonText={ "Start Game" }
			appearance={ "primary" }
			isLoading={ isLoading }
			onClick={ () => mutateAsync( { gameId: params.gameId! } ) }
		/>
	);
};