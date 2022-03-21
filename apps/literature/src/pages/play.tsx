import React, { Fragment } from "react";
import { Flex } from "@s2h/ui/flex";
import { useGame } from "../utils/game-context";
import { VStack } from "@s2h/ui/stack";
import LiteratureIcon from "../assets/literature-icon.png";
import { GameDescription } from "../components/game-description";
import { LitGameStatus } from "@prisma/client";
import { PlayerLobby } from "../components/player-lobby";
import { Banner } from "@s2h/ui/banner";
import { DisplayTeams } from "../components/display-teams";
import { StartGame } from "../components/start-game";
import { CreateTeams } from "../components/create-teams";
import { DisplayHand } from "../components/display-hand";
import { GameStatus } from "../components/game-status";
import { useWindowSize } from "react-use";

export default function () {
	const { game: { status, createdById }, mePlayer } = useGame();

	const { width } = useWindowSize();

	const isCreator = () => createdById === mePlayer.userId;

	const renderBasedOnStatus = () => {
		switch ( status ) {
			case LitGameStatus.NOT_STARTED:
				return [
					<PlayerLobby/>,
					<Banner message={ "Waiting For Players to Join" } isLoading className={ "mt-4" }/>
				];
			case LitGameStatus.PLAYERS_READY:
				return [
					<PlayerLobby/>,
					<Fragment>
						{ !isCreator()
							? <Banner message={ `Waiting For Teams to get Created` } className={ "mt-4" } isLoading/>
							: <CreateTeams/>
						}
					</Fragment>
				];
			case LitGameStatus.TEAMS_CREATED:
				return [
					<DisplayTeams/>,
					<Fragment>
						{ !isCreator()
							? <Banner message={ `Waiting for the game to Start` } className={ "mt-4" } isLoading/>
							: <StartGame/>
						}
					</Fragment>
				];
			case LitGameStatus.IN_PROGRESS:
				return [
					<DisplayTeams/>,
					<Fragment>
						{ width < 1024 && <DisplayHand/> }
						{ width < 1024 && <GameStatus/> }
					</Fragment>
				];
			case LitGameStatus.COMPLETED:
				return [
					<DisplayTeams/>
				];
		}
	};

	return (
		<Flex className={ "lg:h-screen w-screen bg-light-300 divide-x divide-dashed divide-light-700 bg-light-200" }>
			<VStack
				className={ "p-5 lg:w-1/3 w-full divide-light-700 divide-y divide-dashed lg:h-full bg-light-100" }
			>
				<img src={ LiteratureIcon } width={ 80 } height={ 80 } alt={ "literature" }/>
				<GameDescription/>
				{ renderBasedOnStatus() }
			</VStack>
			{ width > 1024 && (
				<Flex className={ "h-full p-5 flex-1" } direction={ "col" } justify={ "space-between" }>
					{ status === LitGameStatus.IN_PROGRESS && (
						<Fragment>
							<DisplayHand/>
							<GameStatus/>
						</Fragment>
					) }
				</Flex>
			) }
		</Flex>
	);
};