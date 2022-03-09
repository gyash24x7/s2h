import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@s2h/ui/button";
import { Modal } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import type { GameCard, Suit } from "@s2h/utils";
import { cardSuitMap, getCardString, getCardSuitsFromHand, getGameCard, isCardInHand } from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { PlayingCard, suitSrcMap } from "./playing-card";
import { PlayerCard } from "./player-card";
import { RadioSelect } from "@s2h/ui/radio-select";
import { Stepper } from "@s2h/ui/stepper";

export function AskCard() {
	const { game, mePlayer } = useGame();

	const myHand = mePlayer.hand.map( getGameCard );

	const cardSuitPossibleValues = getCardSuitsFromHand( myHand );
	const initialCardSuit = cardSuitPossibleValues[ 0 ];
	const initialCard = cardSuitMap[ initialCardSuit ][ 0 ];

	const oppositeTeamPlayers = game.players.filter( player => player.teamId !== mePlayer.teamId );
	const initialPlayer = oppositeTeamPlayers[ 0 ];

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ selectedCardSuit, setSelectedCardSuit ] = useState<Suit>( initialCardSuit );
	const [ selectedCard, setSelectedCard ] = useState<GameCard>( initialCard );
	const [ selectedPlayer, setSelectedPlayer ] = useState<LitPlayer>( initialPlayer );

	const { mutateAsync } = trpc.useMutation( "ask-card", {
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	const handleConfirm = async () => {
		await mutateAsync( { gameId: game.id, askedFor: selectedCard, askedFrom: selectedPlayer.id } );
	};

	return (
		<Fragment>
			<Button
				buttonText={ "Ask Card" }
				appearance={ "primary" }
				fullWidth
				onClick={ () => setIsModalOpen( true ) }
			/>
			<Modal
				isOpen={ isModalOpen }
				onClose={ () => setIsModalOpen( false ) }
				title={ "Ask Card" }
			>
				<Stepper
					steps={ [
						{
							name: "selectCardSuit",
							content: (
								<RadioSelect
									value={ selectedCardSuit }
									onChange={ setSelectedCardSuit }
									options={ cardSuitPossibleValues }
									renderOption={ ( cardSuit, _checked ) => (
										<img
											src={ suitSrcMap[ cardSuit ] }
											alt={ cardSuit }
											className={ "w-16 h-16" }
										/>
									) }
								/>
							)
						},
						{
							name: "selectCard",
							content: (
								<RadioSelect
									value={ selectedCard }
									onChange={ setSelectedCard }
									options={ cardSuitMap[ selectedCardSuit ].filter( card => !isCardInHand(
										myHand,
										card
									) ) }
									renderOption={ ( card, _checked ) => <PlayingCard card={ card }/> }
								/>
							)
						},
						{
							name: "selectPlayer",
							content: (
								<RadioSelect
									value={ selectedPlayer }
									onChange={ setSelectedPlayer }
									options={ oppositeTeamPlayers }
									renderOption={ ( player, _checked ) => <PlayerCard player={ player }/> }
								/>
							)
						},
						{
							name: "confirm",
							content: (
								<h2>Ask { selectedPlayer.name } for { getCardString( selectedCard ) }</h2>
							)
						}
					] }
					onEnd={ handleConfirm }
				/>
			</Modal>
		</Fragment>
	);
}