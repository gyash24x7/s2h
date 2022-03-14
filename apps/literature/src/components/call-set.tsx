import React, { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@s2h/ui/button";
import { Modal, ModalTitle } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import type { GameCard } from "@s2h/utils";
import { CardHand, CardSet, cardSetMap } from "@s2h/utils";
import { cardSetSrcMap, PlayingCard } from "./playing-card";
import { MultiSelect, SingleSelect } from "@s2h/ui/select";
import { Stepper } from "@s2h/ui/stepper";
import { HStack } from "@s2h/ui/stack";
import { Banner } from "@s2h/ui/banner";
import { Flex } from "@s2h/ui/flex";
import type { CallSetInput } from "@s2h/dtos";
import { callSetInputStruct } from "@s2h/dtos";
import type { SelectOption } from "@s2h/ui/select/list-select";
import { sentenceCase } from "change-case";

export function CallSet() {
	const { game, mePlayer } = useGame();

	const myHand = CardHand.from( mePlayer.hand );
	const myTeamPlayers = game.players.filter( player => player.teamId === mePlayer.teamId );
	const cardSetPossibleValues = myHand.getCardSetsInHand()
		.filter( cardSet => myHand.getCardsOfSet( cardSet ).length <= 6 );

	const mapDefaultValue: Record<string, GameCard[]> = {};
	myTeamPlayers.forEach( player => mapDefaultValue[ player.id ] = [] );

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ selectedCardSet, setSelectedCardSet ] = useState<CardSet>();
	const [ cardMap, setCardMap ] = useState<Record<string, GameCard[]>>( mapDefaultValue );


	const { mutateAsync } = trpc.useMutation( "call-set", {
		onSettled() {
			closeModal();
		},
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	const handleCardSelect = ( playerId: string ) => ( cards: SelectOption<GameCard>[] ) => {
		const newCardMap = { ...cardMap };
		newCardMap[ playerId ] = cards.map( card => card.value );
		setCardMap( newCardMap );
	};

	const handleConfirm = async () => {
		const input: CallSetInput = { gameId: game.id, data: cardMap };
		const [ error ] = callSetInputStruct.validate( input );

		if ( !error ) {
			console.log( input );
			await mutateAsync( input );
		} else {
			console.error( error );
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

	const renderCardOption = ( { value }: SelectOption<GameCard> ) => <PlayingCard card={ value }/>;

	const openModal = () => setIsModalOpen( true );

	const closeModal = () => {
		setSelectedCardSet( undefined );
		setCardMap( mapDefaultValue );
		setIsModalOpen( false );
	};

	return (
		<Fragment>
			<Flex justify={ "center" }>
				<Button buttonText={ "Call Set" } appearance={ "info" } onClick={ openModal }/>
			</Flex>
			<Modal isOpen={ isModalOpen } onClose={ closeModal } size={ "sm" }>
				<Stepper
					steps={ [
						{
							name: "selectCardSet",
							content: (
								<Fragment>
									<ModalTitle title={ "Select Card Set to Call" }/>
									<SingleSelect
										value={ selectedCardSet }
										onChange={ setSelectedCardSet }
										options={ cardSetPossibleValues }
										renderOption={ renderCardSetOption }
									/>
								</Fragment>
							)
						},
						...myTeamPlayers.map( player => (
							{
								name: `cardsWith${ player.id }`,
								content: (
									<Fragment key={ player.id }>
										<ModalTitle
											title={ `${ sentenceCase( selectedCardSet || "" ) } With ${ player.name }` }
										/>
										<MultiSelect
											values={ cardMap[ player.id ].map( card => (
												{ label: card.getCardId(), value: card }
											) ) }
											onChange={ handleCardSelect( player.id ) }
											options={ !selectedCardSet
												? []
												: cardSetMap[ selectedCardSet ].map( card => (
													{ label: card.getCardId(), value: card }
												) ) }
											renderOption={ renderCardOption }
										/>
									</Fragment>
								)
							}
						) ),
						{
							name: "confirm",
							content: (
								<Fragment>
									<ModalTitle
										title={ `Confirm Call for ${ sentenceCase( selectedCardSet || "" ) }` }/>
									<Banner message={ `` }/>
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