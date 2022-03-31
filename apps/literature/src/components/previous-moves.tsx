import React, { Fragment, useState } from "react";
import { Button } from "@s2h/ui/button";
import { Modal } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import { VStack } from "@s2h/ui/stack";
import { Banner } from "@s2h/ui/banner";
import { Flex } from "@s2h/ui/flex";
import { getMoveDescription } from "@s2h/utils/literature-utils";

export function PreviousMoves() {
	const { moves, players } = useGame();

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
					{ moves[ 0 ] && (
						<Banner message={ getMoveDescription( players, moves[ 0 ], moves[ 1 ] ) }/>
					) }
					{ moves[ 1 ] && (
						<Banner message={ getMoveDescription( players, moves[ 1 ], moves[ 2 ] ) }/>
					) }
					{ moves[ 2 ] && (
						<Banner message={ getMoveDescription( players, moves[ 2 ], moves[ 3 ] ) }/>
					) }
					{ moves[ 3 ] && (
						<Banner message={ getMoveDescription( players, moves[ 3 ], moves[ 4 ] ) }/>
					) }
				</VStack>
			</Modal>
		</Fragment>
	);
}