import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Stack } from "@s2h/ui/stack";
import { Button } from "@s2h/ui/button";
import { CreateGame } from "components/create-game";
import { JoinGame } from "components/join-game";
import { LoginIcon, LogoutIcon } from "@heroicons/react/solid";
import { UserCard } from "../components/user-card";

// type User = {
// 	name?: string | null
// 	image?: string | null
// 	email?: string | null
// }

const literatureHomePage: NextPage = function () {
	const { data: session } = useSession();
	const [ isCreateGameModalOpen, setIsCreateGameModalOpen ] = useState( false );
	const [ isJoinGameModalOpen, setIsJoinGameModalOpen ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );

	async function login() {
		setIsLoading( true );
		await signIn( "google" );
	}

	async function logout() {
		setIsLoading( true );
		await signOut();
		setIsLoading( false );
	}

	return (
		<Flex justify={ "center" } align={ "center" } className={ "w-screen min-h-screen p-10 bg-dark-700/60" }>
			<div className={ "absolute w-screen h-screen literature-bg top-0 -z-10" }/>
			<Stack orientation={ "vertical" } align={ "center" } className={ "w-80" }>
				<div>
					<img alt="" src={ "/assets/literature-icon.png" } width={ 200 } height={ 200 }/>
				</div>
				{ session && (
					<Button
						buttonText={ "Create Game" }
						appearance={ "primary" }
						fullWidth
						onClick={ () => setIsCreateGameModalOpen( true ) }
					/>
				) }
				{ session && (
					<Button
						buttonText={ "Join Game" }
						appearance={ "warning" }
						fullWidth
						onClick={ () => setIsJoinGameModalOpen( true ) }
					/>
				) }
				<Button buttonText={ "Instructions" } fullWidth appearance={ "success" }/>
				{ !!session
					? (
						<Fragment>
							<UserCard user={ session.user }/>
							<Button
								iconBefore={ LogoutIcon }
								buttonText={ "Logout" }
								appearance={ "danger" }
								onClick={ logout }
								isLoading={ isLoading }
							/>
						</Fragment>
					)
					: (
						<Button
							iconBefore={ LoginIcon }
							buttonText={ "Login with Google" }
							appearance={ "default" }
							onClick={ login }
							isLoading={ isLoading }
						/>
					)
				}
			</Stack>
			<CreateGame isModalOpen={ isCreateGameModalOpen } closeModal={ () => setIsCreateGameModalOpen( false ) }/>
			<JoinGame isModalOpen={ isJoinGameModalOpen } closeModal={ () => setIsJoinGameModalOpen( false ) }/>
		</Flex>
	);
};

export default literatureHomePage;