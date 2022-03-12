import { TextInput } from "@s2h/ui/text-input";
import { Flex } from "@s2h/ui/flex";
import { Modal } from "@s2h/ui/modal";
import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { useParams } from "react-router-dom";
import { Button } from "@s2h/ui/button";

export const CreateTeams = function () {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
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
		<Fragment>
			<Modal
				isOpen={ isModalOpen }
				onClose={ () => setIsModalOpen( false ) }
				title={ "Create Teams" }
				size={ "xs" }
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
					<div className={ "mt-6" }>
						<Button
							size={ "sm" }
							buttonText={ "Submit" }
							appearance={ "primary" }
							isLoading={ isLoading }
							onClick={ () => mutateAsync( { teams: [ team1, team2 ], gameId: params.gameId! } ) }
						/>
					</div>
				</Flex>
			</Modal>
			<Flex justify={ "center" }>
				<Button
					buttonText={ "Create Teams" }
					appearance={ "primary" }
					onClick={ () => setIsModalOpen( true ) }
				/>
			</Flex>
		</Fragment>
	);
};