import { useState } from "react";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import type { LitGame } from "@prisma/client";
import { Modal } from "@s2h/ui/modal";
import { TextInput } from "@s2h/ui/text-input";

export interface CreateGameProps {
	isModalOpen: boolean;
	closeModal: () => any;
}

export const CreateGame = function ( props: CreateGameProps ) {
	const [ alias, setAlias ] = useState( "" );
	const { push } = useRouter();

	const { mutateAsync, isLoading } = trpc.useMutation( "create-lit-game", {
		async onSuccess( data ) {
			const { id } = data as LitGame;
			await push( `/play/${ id }` );
		},
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	return (
		<Modal
			isOpen={ props.isModalOpen }
			onClose={ props.closeModal }
			title={ "Create New Game" }
			actions={ [
				{
					appearance: "primary",
					fullWidth: true,
					onClick: () => mutateAsync( { name: alias } ),
					buttonText: "Submit",
					isLoading
				}
			] }
		>
			<TextInput
				name={ "alias" }
				value={ alias }
				onChange={ setAlias }
				placeholder={ "Enter your alias" }
			/>
		</Modal>
	);
};