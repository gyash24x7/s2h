import { TextInput } from "@s2h/ui/text-input";
import { Flex } from "@s2h/ui/flex";
import { Modal } from "@s2h/ui/modal";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import { useParams } from "react-router-dom";

export interface CreateTeamsProps {
	isModalOpen: boolean;
	closeModal: () => any;
}

export const CreateTeams = function ( props: CreateTeamsProps ) {
	const [ team1, setTeam1 ] = useState( "" );
	const [ team2, setTeam2 ] = useState( "" );
	const params = useParams<{ gameId: string }>();

	const { mutateAsync, isLoading } = trpc.useMutation( "create-lit-teams", {
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	return (
		<Modal
			isOpen={ props.isModalOpen }
			onClose={ props.closeModal }
			title={ "Create Teams" }
			actions={ [
				{
					appearance: "primary",
					fullWidth: true,
					onClick: () => mutateAsync( { teams: [ team1, team2 ], gameId: params.gameId! } ),
					buttonText: "Submit",
					isLoading
				}
			] }
		>
			<Flex direction={ "col" } className={ "space-y-2" }>
				<TextInput
					name={ "team1" }
					value={ team1 }
					onChange={ setTeam1 }
					placeholder={ "Enter Name for Team 1" }
				/>
				<TextInput
					name={ "alias" }
					value={ team2 }
					onChange={ setTeam2 }
					placeholder={ "Enter Name for Team 2" }
				/>
			</Flex>
		</Modal>
	);
};