import React, { createContext, ReactNode, useContext, useState } from "react";
import type { LitGame, LitMove, LitPlayer, LitTeam } from "@prisma/client";
import { useAuth } from "./auth";
import { useParams } from "react-router-dom";
import { trpc } from "./trpc";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { useMount } from "react-use";
import { io } from "socket.io-client";

export interface IGameContext {
	game: LitGame;
	mePlayer: LitPlayer;
	meTeam?: LitTeam;
	currentMove?: LitMove;
}

export const GameContext = createContext<IGameContext>( null! );

export const useGame = () => useContext<IGameContext>( GameContext );

export function GameProvider( props: { children: ReactNode } ) {
	const { user } = useAuth();
	const [ game, setGame ] = useState<LitGame>();
	const params = useParams<{ gameId: string }>();

	const mePlayer = game?.players.find( player => player.userId === user?.id );
	const meTeam = game?.teams.find( team => team.id === mePlayer?.teamId );
	const moves = game?.moves || [];

	const { isLoading } = trpc.useQuery( [ "get-game", { gameId: params.gameId! } ], {
		onSuccess( data ) {
			console.log( data );
			setGame( data );
		}
	} );

	useMount( () => {
		const socket = io( "http://localhost:8000/literature" );
		socket.on( "welcome", ( data ) => {
			console.log( data );
		} );

		socket.on( params.gameId!, ( data: LitGame ) => {
			setGame( data );
		} );

		return () => socket.close();
	} );

	if ( isLoading || !game || !mePlayer ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	return (
		<GameContext.Provider value={ { game, mePlayer, meTeam, currentMove: moves[ 0 ] } }>
			{ props.children }
		</GameContext.Provider>
	);
}