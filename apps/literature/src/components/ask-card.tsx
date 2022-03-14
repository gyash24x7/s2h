import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@s2h/ui/button";
import { Modal, ModalTitle } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import type { GameCard } from "@s2h/utils";
import { CardHand, CardSet, cardSetMap } from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { cardSetSrcMap, PlayingCard } from "./playing-card";
import { PlayerCard } from "./player-card";
import { SingleSelect } from "@s2h/ui/select";
import { Stepper } from "@s2h/ui/stepper";
import { HStack } from "@s2h/ui/stack";
import { Banner } from "@s2h/ui/banner";
import { Flex } from "@s2h/ui/flex";
import type { AskCardInput } from "@s2h/dtos";
import { askCardInputStruct } from "@s2h/dtos";

export function AskCard() {
	const { game, mePlayer } = useGame();
	const myHand = CardHand.from( mePlayer.hand );

	const cardSetPossibleValues = myHand.getCardSetsInHand()
		.filter( cardSet => myHand.getCardsOfSet( cardSet ).length < 6 );

	const oppositeTeamPlayersWithCards = game.players.filter(
		player => player.teamId !== mePlayer.teamId && CardHand.from( player.hand ).length() > 0
	);

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ selectedCardSet, setSelectedCardSet ] = useState<CardSet>();
	const [ selectedCard, setSelectedCard ] = useState<GameCard>();
	const [ selectedPlayer, setSelectedPlayer ] = useState<LitPlayer>();

	const { mutateAsync } = trpc.useMutation( "ask-card", {
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	const handleConfirm = async () => {
		const input: AskCardInput = { gameId: game.id, askedFor: selectedCard!, askedFrom: selectedPlayer!.id };
		const [ error ] = askCardInputStruct.validate( input );

		if ( !error ) {
			await mutateAsync( input );
		}
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
		setSelectedCardSet( undefined );
		setSelectedCard( undefined );
		setSelectedPlayer( undefined );
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
									<SingleSelect
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
									<SingleSelect
										value={ selectedCard }
										onChange={ setSelectedCard }
										options={ !selectedCardSet ? [] : cardSetMap[ selectedCardSet ]
											.filter( card => !myHand.contains( card ) )
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
									<SingleSelect
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
										message={ `Ask ${ selectedPlayer?.name } for ${ selectedCard?.getCardString() }` }
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