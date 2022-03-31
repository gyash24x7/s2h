import React from "react";
import { HStack, VStack } from "@s2h/ui/stack";
import { useGame } from "../utils/game-context";
import { Avatar } from "@s2h/ui/avatar";
import { CardHand } from "@s2h/utils";
import type { LitPlayer, LitTeam } from "@prisma/client";
import { Flex } from "@s2h/ui/flex";

export function DisplayTeams() {
	const { myTeamMembers, myTeam, oppositeTeamMembers, oppositeTeam } = useGame();

	const renderTeam = ( team: LitTeam, members: LitPlayer[] ) => (
		<div className={ "min-w-full my-2" }>
			<Flex className={ "border-b border-dashed border-light-700 w-full" } justify={ "space-between" }>
				<h2 className={ "font-semibold text-xl text-left pb-2 pr-2" }>Team { team.name }</h2>
				<h2 className={ "font-semibold text-xl text-right pb-2 pr-2" }>{ team.score }</h2>
			</Flex>
			{ members.map( player => (
				<Flex key={ player.userId } className={ "py-2 w-full" } justify={ "space-between" }>
					<HStack>
						<Avatar size={ "xs" } name={ player.name } src={ player.avatar }/>
						<h4 className={ "text-base" }>{ player.name }</h4>
					</HStack>
					<div className={ "w-28" }>
						<h4 className={ "text-base text-right" }>
							{ CardHand.from( player.hand ).length() } Cards
						</h4>
					</div>
				</Flex>
			) ) }
		</div>
	);

	return (
		<VStack className={ "divide-light-700 divide-dashed divide-y" }>
			{ renderTeam( myTeam, myTeamMembers ) }
			{ renderTeam( oppositeTeam, oppositeTeamMembers ) }
		</VStack>
	);
}