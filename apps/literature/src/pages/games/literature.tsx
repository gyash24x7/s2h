import React, { useState } from "react";
import { Stack } from "@s2h/ui/stack";
import { Button } from "@s2h/ui/button";
import { HomeIcon } from "@heroicons/react/solid";
import LiteratureIcon from "../../assets/literature-icon.png";

export function LiteratureHome() {
	const [ isCreateGameModalOpen, setIsCreateGameModalOpen ] = useState( false );
	const [ isJoinGameModalOpen, setIsJoinGameModalOpen ] = useState( false );

	return (
		<div className={ "flex flex-col items-center w-screen min-h-screen p-10 bg-black/70" }>
			<div className={ "absolute w-screen h-screen literature-bg top-0 -z-10" }/>
			<Stack orientation={ "vertical" } align={ "center" }>
				<div>
					<img alt="" src={ LiteratureIcon } width={ 200 } height={ 200 }/>
				</div>
				<h1 className={ "font-bold text-5xl pb-10 text-center font-fjalla text-white" }>LITERATURE</h1>
				<Button
					buttonText={ "Create Game" }
					appearance={ "primary" }
					fullWidth
					onClick={ () => setIsCreateGameModalOpen( true ) }
				/>
				<Button
					buttonText={ "Join Game" }
					appearance={ "warning" }
					fullWidth
					onClick={ () => setIsJoinGameModalOpen( true ) }
				/>
				<Button buttonText={ "Instructions" } fullWidth appearance={ "success" }/>
				{/*<UserCard user={ session?.user }/>*/ }
				{ isCreateGameModalOpen }{ isJoinGameModalOpen }
				<Button iconBefore={ HomeIcon } buttonText={ "Logout" } appearance={ "danger" }/>
			</Stack>
			{/*<CreateGame isModalOpen={ isCreateGameModalOpen } closeModal={ () => setIsCreateGameModalOpen( false ) }/>*/ }
			{/*<JoinGame isModalOpen={ isJoinGameModalOpen } closeModal={ () => setIsJoinGameModalOpen( false ) }/>*/ }
		</div>
	);
}