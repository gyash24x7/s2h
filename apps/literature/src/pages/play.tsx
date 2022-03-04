import React, { Fragment, useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { Button } from "@s2h/ui/button";
import { trpc } from "../utils/trpc";
import { CreateTeams } from "../components/create-teams";
import { useParams } from "react-router-dom";

export default function () {
	const [ isCreateTeamsModalOpen, setIsCreateTeamsModalOpen ] = useState( false );
	const params = useParams<{ gameId: string }>();

	const { data, isLoading } = trpc.useQuery( [ "get-game", { gameId: params.gameId! } ] );

	const { mutateAsync } = trpc.useMutation( "start-lit-game" );

	async function startGame() {
		await mutateAsync( { gameId: params.gameId! } );
	}

	if ( isLoading ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	return (
		<Fragment>
			<Flex direction={ "col" } align={ "center" }>
				<h1 className={ "text-5xl" }>LITERATURE</h1>
				<h2 className={ "text-2xl" }>{ data?.id }</h2>
				<h2 className={ "text-2xl" }>{ data?.code }</h2>
				<h2 className={ "text-2xl" }>{ data?.status }</h2>
				<Button
					buttonText={ "Create Teams" }
					appearance={ "primary" }
					fullWidth
					onClick={ () => setIsCreateTeamsModalOpen( true ) }
				/>
				<Button
					buttonText={ "Start Game" }
					appearance={ "primary" }
					fullWidth
					onClick={ startGame }
				/>
			</Flex>
			{ isCreateTeamsModalOpen && (
				<CreateTeams
					isModalOpen={ isCreateTeamsModalOpen }
					closeModal={ () => setIsCreateTeamsModalOpen( false ) }
				/>
			) }
		</Fragment>
	);
};