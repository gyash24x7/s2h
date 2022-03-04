import React from "react";
import { Flex } from "@s2h/ui/flex";
import { Stack } from "@s2h/ui/stack";
import { Button } from "@s2h/ui/button";
import { CreateGame } from "../components/create-game";
import { JoinGame } from "../components/join-game";
import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";
import { UserCard } from "../components/user-card";
import { useAuth } from "../utils/auth";
import literatureIcon from "..//assets/literature-icon.png";

export default function () {
	const { user, login, logout } = useAuth();

	return (
		<Flex justify={ "center" } align={ "center" } className={ "w-screen min-h-screen p-10 bg-dark-700/60" }>
			<div className={ "absolute w-screen h-screen literature-bg top-0 -z-10" }/>
			<Stack orientation={ "vertical" } align={ "center" } className={ "w-80" }>
				<img alt="" src={ literatureIcon } width={ 200 } height={ 200 }/>
				{ !!user && <CreateGame/> }
				{ !!user && <JoinGame/> }
				<Button buttonText={ "Instructions" } fullWidth appearance={ "success" }/>
				{ !!user && <UserCard/> }
				{ !!user && (
					<Button
						iconBefore={ LogoutIcon }
						buttonText={ "Logout" }
						appearance={ "danger" }
						onClick={ logout }
					/>
				) }
				{ !user && (
					<Button
						iconBefore={ LoginIcon }
						buttonText={ "Login with Google" }
						appearance={ "default" }
						onClick={ login }
					/>
				)
				}
			</Stack>
		</Flex>
	);
};