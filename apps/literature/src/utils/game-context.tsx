import React, { createContext, ReactNode, useContext, useState } from "react";
import type { CardSet, LitGame, LitGameStatus, LitMove, LitPlayer, LitTeam, User } from "@prisma/client";
import { useAuth } from "./auth";
import { useParams } from "react-router-dom";
import { trpc } from "./trpc";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { useMount } from "react-use";
import { io } from "socket.io-client";
import { CardHand } from "@s2h/utils";

export class LitGameContext implements LitGame {
	players: LitPlayer[];
	teams: LitTeam[];
	moves: LitMove[];
	id: string;
	code: string;
	status: LitGameStatus;
	playerCount: number;
	createdById: string;
	createdAt: Date;
	updatedAt: Date;
	loggedInUser?: User;

	loggedInPlayer: LitPlayer;
	creator: LitPlayer;
	loggedInPlayerHand: CardHand;
	askableCardSets: CardSet[];
	callableCardSets: CardSet[];

	myTeam: LitTeam;
	oppositeTeam: LitTeam;
	myTeamMembers: LitPlayer[];
	oppositeTeamMembers: LitPlayer[];
	askablePlayers: LitPlayer[];

	currentMove?: LitMove;

	constructor( game: LitGame, user?: User ) {
		this.loggedInUser = user;
		this.players = game.players;
		this.teams = game.teams;
		this.moves = game.moves.reverse();
		this.id = game.id;
		this.code = game.code;
		this.status = game.status;
		this.playerCount = game.playerCount;
		this.createdAt = game.createdAt;
		this.createdById = game.createdById;
		this.updatedAt = game.updatedAt;

		this.loggedInPlayer = this.players.find( player => player.userId === this.loggedInUser?.id )!;
		this.creator = this.players.find( player => player.userId === this.createdById )!;
		this.loggedInPlayerHand = CardHand.from( this.loggedInPlayer.hand );
		this.askableCardSets = this.loggedInPlayerHand.getCardSetsInHand()
			.filter( cardSet => this.loggedInPlayerHand.getCardsOfSet( cardSet ).length < 6 );
		this.callableCardSets = this.loggedInPlayerHand.getCardSetsInHand()
			.filter( cardSet => this.loggedInPlayerHand.getCardsOfSet( cardSet ).length <= 6 );

		this.myTeam = this.teams[ 0 ]?.id === this.loggedInPlayer.teamId ? this.teams[ 0 ] : this.teams[ 1 ];
		this.oppositeTeam = this.teams[ 0 ]?.id !== this.loggedInPlayer.teamId ? this.teams[ 0 ] : this.teams[ 1 ];
		this.myTeamMembers = this.players.filter( player => player.teamId === this.loggedInPlayer.teamId );
		this.oppositeTeamMembers = this.players.filter( player => player.teamId !== this.loggedInPlayer.teamId );
		this.askablePlayers = this.oppositeTeamMembers.filter( player => CardHand.from( player.hand ).length() > 0 );

		this.currentMove = this.moves[ 0 ];
	}
}

const litGameContext = createContext<LitGameContext>( null! );

export const useGame = () => useContext( litGameContext );

export function GameProvider( props: { children: ReactNode } ) {
	const { user } = useAuth();
	const [ ctx, setCtx ] = useState<LitGameContext>();
	const params = useParams<{ gameId: string }>();

	const { isLoading } = trpc.useQuery( [ "get-game", { gameId: params.gameId! } ], {
		onSuccess( data ) {
			setCtx( new LitGameContext( data, user ) );
		}
	} );

	useMount( () => {
		const socket = io( "http://localhost:8000/literature" );
		socket.on( "welcome", ( data ) => {
			console.log( data );
		} );

		socket.on( params.gameId!, ( data: LitGame ) => {
			setCtx( new LitGameContext( data, user ) );
		} );

		return () => socket.close();
	} );

	if ( isLoading || !ctx ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	return (
		<litGameContext.Provider value={ ctx }>
			{ props.children }
		</litGameContext.Provider>
	);
}