import React, { Fragment, useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { trpc } from "../utils/trpc";
import { useParams } from "react-router-dom";
import { VStack } from "@s2h/ui/stack";
import { PlayerLobby } from "../components/player-lobby";
import type { LitGameData } from "@s2h/utils";
import { GameDescription } from "../components/game-description";
import { DisplayTeams } from "../components/display-teams";
import type { LitGameStatus } from "@prisma/client";
import { DisplayHand } from "../components/display-hand";
import { useAuth } from "../utils/auth";
import { GameContext } from "../utils/game-context";
import { Banner } from "@s2h/ui/banner";
import literatureIcon from "../assets/literature-icon.png";
import { GameStatus } from "../components/game-status";
import { Card } from "@s2h/ui/card";
import { getMoveDescription } from "@s2h/utils/literature-utils";

const statusMap: Record<LitGameStatus, number> = {
	NOT_STARTED: 1,
	PLAYERS_READY: 2,
	TEAMS_CREATED: 3,
	IN_PROGRESS: 4,
	COMPLETED: 5
};

export default function () {
	const { user } = useAuth();
	const [ game, setGame ] = useState<LitGameData>();
	const params = useParams<{ gameId: string }>();

	const mePlayer = game?.players.find( player => player.userId === user?.id );
	const meTeam = game?.teams.find( team => team.id === mePlayer?.teamId );
	const moves = game?.moves || [];

	const { isLoading } = trpc.useQuery( [ "get-game", { gameId: params.gameId! } ], {
		onSuccess( data ) {
			setGame( data );
		}
	} );

	trpc.useSubscription( [ "lit-game", { gameId: params.gameId! } ], {
		onNext( data: LitGameData ) {
			console.log( "On Next Called" );
			setGame( data );
		}
	} );

	if ( isLoading || !game || !mePlayer ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	console.log( game )

	return (
		<GameContext.Provider value={ { game, mePlayer, meTeam, currentMove: moves[ 0 ] } }>
			<VStack className={ "p-4 bg-light-300 min-h-screen" } spacing={ "lg" }>
				<Card
					content={
						<img alt="" src={ literatureIcon } width={ 100 } height={ 100 } className={ "mx-auto" }/>
					}
				/>
				{ statusMap[ game.status ] === 1 && <GameDescription/> }
				{ statusMap[ game.status ] >= 3 && <DisplayTeams/> }
				<PlayerLobby/>
				{ statusMap[ game.status ] === 1 && (
					<Banner message={ "Waiting for All Players to Join..." } isLoading centered/>
				) }
				{ game.status === "IN_PROGRESS" && <DisplayHand/> }
				{ statusMap[ game.status ] <= 3 && (
					<Fragment>
						{ game.createdBy.id === user?.id ? (
							<GameStatus/>
						) : (
							<Fragment>
								{ game.status === "PLAYERS_READY" && (
									<Banner
										isLoading
										message={ `Waiting for ${ game.createdBy.name } to create teams...` }
									/>
								) }
								{ game.status === "TEAMS_CREATED" && (
									<Banner
										isLoading
										message={ `Waiting for ${ game.createdBy.name } to start the game...` }
									/>
								) }
							</Fragment>
						) }
					</Fragment>
				) }
				{ statusMap[ game.status ] >= 4 && (
					<Banner message={ getMoveDescription( game.players, game.moves[ 0 ], game.moves[ 1 ] ) }/>
				) }
				{ statusMap[ game.status ] >= 4 && <GameStatus/> }
			</VStack>
		</GameContext.Provider>
	);
};