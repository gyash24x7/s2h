import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { Button, ButtonProps } from "../button";
import { Stack } from "../stack";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	actions?: ButtonProps[];
	children?: ReactNode;
}

export function Modal( { isOpen, onClose, children, title, actions }: ModalProps ) {
	return (
		<Transition appear show={ isOpen } as={ Fragment }>
			<Dialog as="div" className={ "modal-root" } onClose={ onClose }>
				<div>
					<Transition.Child
						as={ Fragment }
						enter="overlay-transition--enter"
						enterFrom="overlay-transition--enter-from"
						enterTo="overlay-transition--enter-to"
						leave="overlay-transition--leave"
						leaveFrom="overlay-transition--leave-from"
						leaveTo="overlay-transition--leave-to"
					>
						<Dialog.Overlay className={ "modal-backdrop" }/>
					</Transition.Child>
					<span className={ "modal-align" } aria-hidden="true"/>
					<Transition.Child
						as={ Fragment }
						enter="modal-content-transition--enter"
						enterFrom="modal-content-transition--enter-from"
						enterTo="modal-content-transition--enter-to"
						leave="modal-content-transition--leave"
						leaveFrom="modal-content-transition--leave-from"
						leaveTo="modal-content-transition--leave-to"
					>
						<div className={ "modal-content" }>
							{ title && <Dialog.Title as="h3" className={ "modal-title" }>{ title }</Dialog.Title> }
							{ children && <div className={ "modal-body" }>{ children }</div> }
							<Stack spacing={ "sm" }>
								{ actions?.map( ( btnProps ) => (
									<Button key={ btnProps.buttonText } { ...btnProps } size={ "sm" }/>
								) ) }
							</Stack>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}