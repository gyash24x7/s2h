import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@s2h/ui/button";
import { Modal, ModalTitle } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import type { GameCard } from "@s2h/utils";
import {
	CardSet,
	cardSetMap,
	getCardSentenceString,
	getCardSetsFromHand,
	getGameCard,
	getNumberOfCardsOfSetInHand,
	isCardInHand
} from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { cardSetSrcMap, PlayingCard } from "./playing-card";
import { PlayerCard } from "./player-card";
import { RadioSelect } from "@s2h/ui/radio-select";
import { Stepper } from "@s2h/ui/stepper";
import { HStack } from "@s2h/ui/stack";
import { Banner } from "@s2h/ui/banner";
import { Flex } from "@s2h/ui/flex";

export function AskCard() {
	const { game, mePlayer } = useGame();

	const myHand = mePlayer.hand.map( getGameCard );

	const cardSetPossibleValues = getCardSetsFromHand( myHand )
		.filter( cardSet => getNumberOfCardsOfSetInHand( myHand, cardSet ) < 6 );
	const initialCardSet = cardSetPossibleValues[ 0 ];
	const initialCard = cardSetMap[ initialCardSet ][ 0 ];

	const oppositeTeamPlayersWithCards = game.players
		.filter( player => player.teamId !== mePlayer.teamId && player.hand.length > 0 );
	const initialPlayer = oppositeTeamPlayersWithCards[ 0 ];

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ selectedCardSet, setSelectedCardSet ] = useState<CardSet>( initialCardSet );
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

	const renderCardSetOption = ( cardSet: CardSet ) => {
		const colorClass = cardSet.includes( "SPADES" ) || cardSet.includes( "CLUBS" )
			? "text-dark-700"
			: "text-danger";

		return (
			<HStack spacing={ "xs" }>
				<h2 className={ `font-fjalla text-4xl ${ colorClass }` }>{ cardSet.split( "_" )[ 0 ] }</h2>
				<img
					src={ cardSetSrcMap[ cardSet ] }
					alt={ cardSet }
					className={ "w-8 h-8" }
				/>
			</HStack>
		);
	};

	const renderCardOption = ( card: GameCard ) => <PlayingCard card={ card }/>;

	const renderPlayerOption = ( player: LitPlayer ) => <PlayerCard player={ player }/>;

	const openModal = () => setIsModalOpen( true );

	const closeModal = () => {
		setSelectedCardSet( initialCardSet );
		setSelectedCard( initialCard );
		setSelectedPlayer( initialPlayer );
		setIsModalOpen( false );
	};

	return (
		<Fragment>
			<Flex justify={ "center" }>
				<Button buttonText={ "Ask Card" } appearance={ "alt" } onClick={ openModal }/>
			</Flex>
			<Modal isOpen={ isModalOpen } onClose={ closeModal } size={ "sm" }>
				<Stepper
					steps={ [
						{
							name: "selectCardSet",
							content: (
								<Fragment>
									<ModalTitle title={ "Select Card Set to Ask From" }/>
									<RadioSelect
										value={ selectedCardSet }
										onChange={ setSelectedCardSet }
										options={ cardSetPossibleValues }
										renderOption={ renderCardSetOption }
									/>
								</Fragment>
							)
						},
						{
							name: "selectCard",
							content: (
								<Fragment>
									<ModalTitle title={ "Select Card to Ask" }/>
									<RadioSelect
										value={ selectedCard }
										onChange={ setSelectedCard }
										options={ cardSetMap[ selectedCardSet ]
											.filter( card => !isCardInHand( myHand, card ) )
										}
										renderOption={ renderCardOption }
									/>
								</Fragment>
							)
						},
						{
							name: "selectPlayer",
							content: (
								<Fragment>
									<ModalTitle title={ "Select Player to Ask From" }/>
									<RadioSelect
										value={ selectedPlayer }
										onChange={ setSelectedPlayer }
										options={ oppositeTeamPlayersWithCards }
										renderOption={ renderPlayerOption }
									/>
								</Fragment>
							)
						},
						{
							name: "confirm",
							content: (
								<Fragment>
									<ModalTitle title={ "Confirm your Ask" }/>
									<Banner
										message={ `
											Ask ${ selectedPlayer.name } for 
											${ getCardSentenceString( selectedCard ) }
										` }
									/>
								</Fragment>
							)
						}
					] }
					onEnd={ handleConfirm }
				/>
			</Modal>
		</Fragment>
	);
}