import { Avatar } from "@s2h/ui/avatar";
import { HStack } from "@s2h/ui/stack";
import React from "react";
import type { LitPlayer } from "@prisma/client";
import type { Size } from "@s2h/ui/utils";

export interface PlayerCardProps {
	player: LitPlayer;
	size?: Size;
}

export function PlayerCard( { player, size = "lg" }: PlayerCardProps ) {
	return (
		<HStack centered spacing={ "sm" } stackItemClassName={ "mb-6" }>
			<Avatar src={ player?.avatar } size={ size }/>
			<div>
				<p className={ "text-lg font-semibold" }>{ player?.name?.split( " " )[ 0 ].toUpperCase() }</p>
				<p className={ "text-base text-dark-200" }>No. of Cards: { player?.hand?.length }</p>
			</div>
		</HStack>
	);
}