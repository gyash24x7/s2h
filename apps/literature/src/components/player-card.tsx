import { Avatar } from "@s2h/ui/avatar";
import { HStack } from "@s2h/ui/stack";
import React from "react";
import type { LitPlayer } from "@prisma/client";

export interface PlayerCardProps {
	player: LitPlayer;
}

export function PlayerCard( { player }: PlayerCardProps ) {
	return (
		<HStack centered spacing={ "sm" }>
			<Avatar src={ player?.avatar } size={ "lg" }/>
			<div>
				<p className={ "text-lg font-semibold" }>{ player?.name?.split( " " )[ 0 ].toUpperCase() }</p>
				<p className={ "text-base text-dark-200" }>No. of Cards: { player.hand.length }</p>
			</div>
		</HStack>
	);
}