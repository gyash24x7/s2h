import React, { Fragment, useState } from "react";
import { Button } from "@s2h/ui/button";
import { Modal } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import { VStack } from "@s2h/ui/stack";
import { Banner } from "@s2h/ui/banner";
import { Flex } from "@s2h/ui/flex";
import { getMoveDescription } from "@s2h/utils/literature-utils";

export function PreviousMoves() {
	const { game } = useGame();

	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const openModal = () => setIsModalOpen( true );

	const closeModal = () => {
		setIsModalOpen( false );
	};

	return (
		<Fragment>
			<Flex justify={ "center" }>
				<Button buttonText={ "Previous Moves" } appearance={ "default" } onClick={ openModal }/>
			</Flex>
			<Modal isOpen={ isModalOpen } onClose={ closeModal } title={ "Previous Moves" }>
				<VStack>
					<Banner message={ getMoveDescription( game.players, game.moves[ 0 ], game.moves[ 1 ] ) }/>
					<Banner message={ getMoveDescription( game.players, game.moves[ 1 ], game.moves[ 2 ] ) }/>
					<Banner message={ getMoveDescription( game.players, game.moves[ 2 ], game.moves[ 3 ] ) }/>
					<Banner message={ getMoveDescription( game.players, game.moves[ 3 ], game.moves[ 4 ] ) }/>
				</VStack>
			</Modal>
		</Fragment>
	);
}