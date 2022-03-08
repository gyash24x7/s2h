import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { getClassname, Size } from "../utils";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: Size;
	children?: ReactNode;
}

export function Modal( { isOpen, onClose, children, title, size }: ModalProps ) {
	return (
		<Transition appear show={ isOpen } as={ Fragment }>
			<Dialog as="div" className={ getClassname( "modal-root", { size: size || "md" } ) } onClose={ onClose }>
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
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}