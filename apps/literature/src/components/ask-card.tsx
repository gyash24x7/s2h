import React, { Fragment, ReactNode, useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@s2h/ui/button";
import { Modal } from "@s2h/ui/modal";
import { useGame } from "../utils/game-context";
import type { GameCard, Suit } from "@s2h/utils";
import { cardSuitMap, getCardId, getCardString, getCardSuitsFromHand, getGameCard, isCardInHand } from "@s2h/utils";
import type { LitPlayer } from "@prisma/client";
import { RadioGroup } from "@headlessui/react";
import { Stack } from "@s2h/ui/stack";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import { PlayingCard, suitSrcMap } from "./playing-card";
import { Flex } from "@s2h/ui/flex";
import { PlayerCard } from "./player-card";

type FormStep = "selectCardSuit" | "selectCard" | "selectPlayer" | "confirm";

export function AskCard() {
	const { game, mePlayer } = useGame();

	const myHand = mePlayer.hand.map( getGameCard );

	const cardSuitPossibleValues = getCardSuitsFromHand( myHand );
	const initialCardSuit = cardSuitPossibleValues[ 0 ];
	const initialCard = cardSuitMap[ initialCardSuit ][ 0 ];

	const oppositeTeamPlayers = game.players.filter( player => player.teamId !== mePlayer.teamId );
	const initialPlayer = oppositeTeamPlayers[ 0 ];

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ formStep, setFormStep ] = useState<FormStep>( "selectCardSuit" );
	const [ selectedCardSuit, setSelectedCardSuit ] = useState<Suit>( initialCardSuit );
	const [ selectedCard, setSelectedCard ] = useState<GameCard>( initialCard );
	const [ selectedPlayer, setSelectedPlayer ] = useState<LitPlayer>( initialPlayer );

	const modalTitles = {
		confirm: "Ask Card: Confirmation",
		selectCardSuit: "Ask Card: Select Card Suit",
		selectCard: "Ask Card: Select Card",
		selectPlayer: "Ask Card: Select Player"
	};

	const { mutateAsync, isLoading } = trpc.useMutation( "ask-card", {
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	const formStepContent: Record<typeof formStep, ReactNode> = {
		confirm: (
			<h2>Ask { selectedPlayer.name } for { getCardString( selectedCard ) }</h2>
		),
		selectCardSuit: (
			<RadioGroup value={ selectedCardSuit } onChange={ setSelectedCardSuit }>
				<Stack>
					{ cardSuitPossibleValues.map( ( cardSuit ) => (
						<RadioGroup.Option
							key={ cardSuit }
							value={ cardSuit }
							className={ ( { checked } ) => `hover:bg-light-300 outline-none cursor-pointer p-2 
							rounded-md ${ checked ? "bg-primary-100 hover:bg-primary-100" : "" }`
							}
						>
							<img src={ suitSrcMap[ cardSuit ] } alt={ cardSuit } className={ "w-16 h-16" }/>
						</RadioGroup.Option>
					) ) }
				</Stack>
			</RadioGroup>
		),
		selectCard: (
			<RadioGroup value={ selectedCard } onChange={ setSelectedCard }>
				<Flex className={ "flex-wrap -mx-2" } justify={ "space-between" }>
					{ cardSuitMap[ selectedCardSuit ]
						.filter( card => !isCardInHand( myHand, card ) )
						.map( ( card ) => (
							<RadioGroup.Option
								key={ getCardId( card ) }
								value={ card }
								className={ ( { checked } ) => `hover:bg-light-300 outline-none cursor-pointer 
							rounded-md ${ checked ? "bg-primary-100 hover:bg-primary-100" : "" }`
								}
							>
								<PlayingCard card={ card }/>
							</RadioGroup.Option>
						) ) }
				</Flex>
			</RadioGroup>
		),
		selectPlayer: (
			<RadioGroup value={ selectedPlayer } onChange={ setSelectedPlayer }>
				<Stack>
					{ oppositeTeamPlayers.map( ( player ) => (
						<RadioGroup.Option
							key={ player.id }
							value={ player }
							className={ ( { checked } ) => `p-2 hover:bg-light-300 outline-none cursor-pointer 
							rounded-md ${ checked ? "bg-primary-100 hover:bg-primary-100" : "" }`
							}
						>
							<PlayerCard player={ player }/>
						</RadioGroup.Option>
					) ) }
				</Stack>
			</RadioGroup>
		)
	};

	function handlePrevious() {
		switch ( formStep ) {
			case "selectCard":
				setFormStep( "selectCardSuit" );
				break;
			case "selectPlayer":
				setFormStep( "selectCard" );
				break;
		}
	}

	function handleNext() {
		switch ( formStep ) {
			case "selectCard":
				setFormStep( "selectPlayer" );
				break;
			case "selectCardSuit":
				setFormStep( "selectCard" );
				break;
			case "selectPlayer":
				setFormStep( "confirm" );
				break;
		}
	}

	function handleReset() {
		setSelectedCardSuit( initialCardSuit );
		setSelectedCard( initialCard );
		setSelectedPlayer( initialPlayer );
		setFormStep( "selectCardSuit" );
	}

	async function handleConfirm() {
		await mutateAsync( { gameId: game.id, askedFor: selectedCard, askedFrom: selectedPlayer.id } );
	}

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
				title={ modalTitles[ formStep ] }
			>
				{ formStepContent[ formStep ] }
				{ formStep === "confirm" ? (
					<Stack className={ "mt-6" }>
						<Button buttonText={ "Reset" } appearance={ "default" } size={ "sm" } onClick={ handleReset }/>
						<Button
							buttonText={ "Submit" }
							appearance={ "primary" }
							size={ "sm" }
							onClick={ handleConfirm }
							isLoading={ isLoading }
						/>
					</Stack>
				) : (
					<Stack className={ "mt-6" }>
						{ formStep !== "selectCardSuit" && (
							<Button
								buttonText={ "Previous" }
								appearance={ "default" }
								iconBefore={ ArrowLeftIcon }
								size={ "sm" }
								onClick={ handlePrevious }
							/>
						) }
						<Button
							buttonText={ "Next" }
							appearance={ "primary" }
							iconAfter={ ArrowRightIcon }
							size={ "sm" }
							onClick={ handleNext }
						/>
					</Stack>
				) }
			</Modal>
		</Fragment>
	);
}