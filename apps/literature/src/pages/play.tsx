import React from "react";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { trpc } from "../utils/trpc";
import { CreateTeams } from "../components/create-teams";
import { useParams } from "react-router-dom";
import literatureIcon from "../assets/literature-icon.png";
import { StartGame } from "../components/start-game";
import { PlayerCard } from "../components/player-card";
import { Stack } from "@s2h/ui/stack";
import { Button } from "@s2h/ui/button";

export default function () {
	const params = useParams<{ gameId: string }>();
	const { data, isLoading } = trpc.useQuery( [ "get-game", { gameId: params.gameId! } ] );

	if ( isLoading ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	return (
		<Stack orientation={ "vertical" } className={ "w-screen min-h-screen p-5 king-yna-bg" }>
			<Flex
				expand
				justify={ "space-between" }
				align={ "center" }
				className={ "bg-light-300/50 rounded-md px-5 w-full border border-light-700" }
			>
				<img alt="" src={ literatureIcon } width={ 100 } height={ 100 }/>
				<Stack align={ "center" } spacing={ "xl" }>
					<h1 className={ "text-6xl font-fjalla my-2" }>Code: { data?.code }</h1>
					<Button buttonText={ "Copy Code" } size={ "lg" }/>
				</Stack>
			</Flex>
			<div className={ "bg-light-300/50 rounded-md p-5 w-full border border-light-700" }>
				<h2 className={ "text-xl mb-2 font-semibold" }>Players Joined</h2>
				<Stack>
					{ data?.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
					{ data?.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
					{ data?.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
					{ data?.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
					{ data?.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
					{ data?.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
				</Stack>
			</div>
			{ data?.status === "PLAYERS_READY" && <CreateTeams/> }
			{ data?.status === "TEAMS_CREATED" && <StartGame/> }
		</Stack>
	);
};