import React from "react";
import { trpc } from "../utils/trpc";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@s2h/ui/button";
import { Flex } from "@s2h/ui/flex";

export const StartGame = function () {
	const params = useParams<{ gameId: string }>();
	const navigate = useNavigate();

	const { mutateAsync, isLoading } = trpc.useMutation( "start-game", {
		async onSuccess( { id } ) {
			navigate( `/play/${ id }` );
		},
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	const startGame = () => mutateAsync( { gameId: params.gameId! } );

	return (
		<Flex justify={ "center" } className={ "mt-4" }>
			<Button
				fullWidth
				buttonText={ "Start Game" }
				appearance={ "primary" }
				isLoading={ isLoading }
				onClick={ startGame }
			/>
		</Flex>
	);
};