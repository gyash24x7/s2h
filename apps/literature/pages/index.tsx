import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Flex } from "@s2h/ui/flex";
import { Stack } from "@s2h/ui/stack";
import { Button } from "@s2h/ui/button";
import { useRouter } from "next/router";
import { CreateGame } from "../components/create-game";
import { JoinGame } from "../components/join-game";

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
	const { replace } = useRouter();

	async function login() {
		setIsLoading( true );
		await signIn( "auth0" );
	}

	async function logout() {
		setIsLoading( true );
		const appLogoutUrl = encodeURIComponent( "http://localhost:3000/logout" );
		const idpLogoutUrl = `${ process.env[ "NEXT_PUBLIC_AUTH0_ISSUER" ] }/v2/logout?returnTo=${ appLogoutUrl }&client_id=${ process.env[ "NEXT_PUBLIC_AUTH0_CLIENT_ID" ] }`;
		await replace( idpLogoutUrl );
	}

	console.log( session );

	return (
		<Flex justify={ "center" } align={ "center" } className={ "w-screen min-h-screen p-10 bg-dark-700/60" }>
			<div className={ "absolute w-screen h-screen literature-bg top-0 -z-10" }/>
			<Stack orientation={ "vertical" } align={ "center" } className={ "w-80" }>
				<div>
					<img alt="" src={ "/assets/literature-icon.png" } width={ 200 } height={ 200 }/>
				</div>
				<h1 className={ "font-black text-5xl pb-10 text-center font-fjalla text-white" }>LITERATURE</h1>
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
					? <Button buttonText={ "Logout" } appearance={ "danger" } onClick={ logout }
							  isLoading={ isLoading }/>
					: <Button buttonText={ "Login" } appearance={ "primary" } onClick={ login }
							  isLoading={ isLoading }/>
				}
			</Stack>
			<CreateGame isModalOpen={ isCreateGameModalOpen } closeModal={ () => setIsCreateGameModalOpen( false ) }/>
			<JoinGame isModalOpen={ isJoinGameModalOpen } closeModal={ () => setIsJoinGameModalOpen( false ) }/>
		</Flex>
	);
};

export default literatureHomePage;