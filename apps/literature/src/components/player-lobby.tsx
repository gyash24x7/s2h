import React from "react";
import { Stack } from "@s2h/ui/stack";
import { PlayerCard } from "./player-card";
import type { LitGameData } from "@s2h/utils";
import { MessageBanner } from "./message-banner";

export interface PlayerLobbyProps {
	game: LitGameData;
}

export const PlayerLobby = function ( { game }: PlayerLobbyProps ) {
	return (
		<Stack orientation={ "vertical" } className={ "w-full" }>
			<div className={ "bg-light-300 rounded-md p-5 w-full border border-light-700" }>
				<h2 className={ "text-xl mb-2 font-semibold" }>Players Joined</h2>
				<Stack className={ "flex-wrap" }>
					{ game.players.map( player => (
						<PlayerCard player={ player } key={ player.id }/>
					) ) }
				</Stack>
			</div>
			{ game.status === "NOT_STARTED" && (
				<MessageBanner message={ "Waiting for All Players to Join..." }/>
			) }
		</Stack>
	);
};