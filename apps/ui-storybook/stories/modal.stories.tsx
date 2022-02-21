import { Meta, Story } from "@storybook/react";
import { Modal, ModalProps } from "@s2h/ui/modal";

export default { component: Modal, title: "Modal" } as Meta<ModalProps>;

const Template: Story<ModalProps> = args => <Modal { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	title: "Modal Story",
	onClose: () => console.log( "Modal Closed!" ),
	isOpen: true,
	children: (
		<div>Hello from modal child</div>
	),
	actions: [ { appearance: "primary", buttonText: "Action Button" }, { buttonText: "Cancel", appearance: "default" } ]
} as ModalProps;