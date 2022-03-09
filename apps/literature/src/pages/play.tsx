import React, { Fragment, useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { trpc } from "../utils/trpc";
import { CreateTeams } from "../components/create-teams";
import { useParams } from "react-router-dom";
import literatureIcon from "../assets/literature-icon.png";
import { StartGame } from "../components/start-game";
import { VStack } from "@s2h/ui/stack";
import { PlayerLobby } from "../components/player-lobby";
import type { LitGameData } from "@s2h/utils";
import { GameDescription } from "../components/game-description";
import { DisplayTeams } from "../components/display-teams";
import { LitGameStatus, LitMoveType } from "@prisma/client";
import { DisplayHand } from "../components/display-hand";
import { useAuth } from "../utils/auth";
import { AskCard } from "../components/ask-card";
import { GameContext } from "../utils/game-context";
import { Banner } from "@s2h/ui/banner";

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

	const mePlayer = game?.players.find( player => player.userId === user?.id )!;
	const meTeam = game?.teams.find( team => team.id === mePlayer?.teamId );
	const lastMove = game?.moves[ 0 ];
	// const secondLastMove = game?.moves.reverse()[ 1 ];

	const { isLoading } = trpc.useQuery( [ "get-game", { gameId: params.gameId! } ], {
		onSuccess( data ) {
			setGame( data );
		}
	} );

	trpc.useSubscription( [ "lit-game", { gameId: params.gameId! } ], {
		onNext( data: LitGameData ) {
			setGame( data );
		}
	} );

	if ( isLoading || !game ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	return (
		<GameContext.Provider value={ { game, mePlayer, meTeam } }>
			<VStack className={ "p-4" } spacing={ "lg" }>
				<img alt="" src={ literatureIcon } width={ 100 } height={ 100 }/>
				{ statusMap[ game.status ] === 1 && <GameDescription game={ game }/> }
				{ statusMap[ game.status ] <= 2 && <PlayerLobby game={ game }/> }
				{ statusMap[ game.status ] === 1 && (
					<Banner message={ "Waiting for All Players to Join..." } isLoading/>
				) }
				{ statusMap[ game.status ] >= 3 && <DisplayTeams/> }
				{ game.status === "IN_PROGRESS" && <DisplayHand/> }
				{ statusMap[ game.status ] <= 3 && (
					<Fragment>
						{ game.createdBy.id === user?.id ? (
							<Fragment>
								{ game.status === "PLAYERS_READY" && <CreateTeams/> }
								{ game.status === "TEAMS_CREATED" && <StartGame/> }
							</Fragment>
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
				{ lastMove?.type === LitMoveType.TURN && (
					<Fragment>
						{ lastMove?.turnId === mePlayer?.id && (
							<AskCard/>
						) }
					</Fragment>
				) }
				{ lastMove?.type === LitMoveType.ASK && (
					<Fragment>
						{ lastMove?.askedFromId === mePlayer?.id && (
							<AskCard/>
						) }
					</Fragment>
				) }
			</VStack>
		</GameContext.Provider>
	);
};