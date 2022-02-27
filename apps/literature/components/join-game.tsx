import { TextInput } from "@s2h/ui/text-input";
import { Flex } from "@s2h/ui/flex";
import { Modal } from "@s2h/ui/modal";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import type { LitGame } from "@prisma/client";

export interface JoinGameProps {
	isModalOpen: boolean;
	closeModal: () => any;
}

export const JoinGame = function ( props: JoinGameProps ) {
	const [ alias, setAlias ] = useState( "" );
	const [ code, setCode ] = useState( "" );
	const { push } = useRouter();

	const { mutateAsync, isLoading } = trpc.useMutation( "join-lit-game", {
		async onSuccess( data ) {
			const { id } = data as LitGame;
			await push( `/games/literature/${ id }` );
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
			title={ "Join Game" }
			actions={ [
				{
					appearance: "primary",
					fullWidth: true,
					onClick: () => mutateAsync( { name: alias, code } ),
					buttonText: "Submit",
					isLoading
				}
			] }
		>
			<Flex direction={ "col" } className={ "space-y-2" }>
				<TextInput
					name={ "gameCode" }
					value={ code }
					onChange={ setCode }
					placeholder={ "Enter the 6-digit Game Code" }
				/>
				<TextInput
					name={ "alias" }
					value={ alias }
					onChange={ setAlias }
					placeholder={ "Enter your Player Alias" }
				/>
			</Flex>
		</Modal>
	);
};