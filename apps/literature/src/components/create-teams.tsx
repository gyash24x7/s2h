import { TextInput } from "@s2h/ui/text-input";
import { Flex } from "@s2h/ui/flex";
import { Modal } from "@s2h/ui/modal";
import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@s2h/ui/button";
import { useGame } from "../utils/game-context";

export const CreateTeams = function () {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ team1, setTeam1 ] = useState( "" );
	const [ team2, setTeam2 ] = useState( "" );
	const { id } = useGame();

	const { mutateAsync, isLoading } = trpc.useMutation( "create-teams", {
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	const createTeams = () => mutateAsync( { teams: [ team1, team2 ], gameId: id } );

	const openModal = () => setIsModalOpen( true );

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
							onClick={ createTeams }
						/>
					</div>
				</Flex>
			</Modal>
			<Flex justify={ "center" } className={ "mt-4" }>
				<Button
					fullWidth
					buttonText={ "Create Teams" }
					appearance={ "primary" }
					onClick={ openModal }
				/>
			</Flex>
		</Fragment>
	);
};