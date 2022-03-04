import { TextInput } from "@s2h/ui/text-input";
import { Modal } from "@s2h/ui/modal";
import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import type { LitGame } from "@prisma/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@s2h/ui/button";

export const JoinGame = function () {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ code, setCode ] = useState( "" );
	const navigate = useNavigate();

	const { mutateAsync, isLoading } = trpc.useMutation( "join-lit-game", {
		async onSuccess( data ) {
			const { id } = data as LitGame;
			await navigate( `/play/${ id }` );
		},
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	return (
		<Fragment>
			<Button
				buttonText={ "Join Game" }
				appearance={ "warning" }
				fullWidth
				onClick={ () => setIsModalOpen( true ) }
			/>
			<Modal
				isOpen={ isModalOpen }
				onClose={ () => setIsModalOpen( false ) }
				title={ "Join Game" }
				actions={ [
					{
						appearance: "primary",
						fullWidth: true,
						onClick: () => mutateAsync( { code } ),
						buttonText: "Submit",
						isLoading
					}
				] }
			>
				<TextInput
					name={ "gameCode" }
					value={ code }
					onChange={ setCode }
					placeholder={ "Enter the 6-digit Game Code" }
				/>
			</Modal>
		</Fragment>
	);
};