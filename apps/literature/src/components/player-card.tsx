import { Avatar } from "@s2h/ui/avatar";
import { Stack } from "@s2h/ui/stack";
import React from "react";
import type { LitPlayer } from "@prisma/client";

export interface PlayerCardProps {
	player: LitPlayer;
}

export function PlayerCard( { player }: PlayerCardProps ) {
	return (
		<Stack centered align={ "center" } orientation={ "vertical" } className={ "m-5" }>
			<Avatar name={ player?.name } src={ player?.avatar } size={ "2xl" }/>
			<div className={ "text-center" }>
				<p className={ "text-lg" }>{ player?.name?.toUpperCase() }</p>
				<p className={ "text-base text-dark-200" }>No. of Cards: { player.hand.length }</p>
			</div>
		</Stack>
	);
}