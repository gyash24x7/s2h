import { Meta, Story } from "@storybook/react";
import { Select, SelectProps } from "@s2h/ui/select";

export default { component: Select, title: "Select" } as Meta<SelectProps>;

const Template: Story<SelectProps> = args => <Select { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	options: [
		{ label: "Person 1", value: "AB" },
		{ label: "Person 2", value: "CD" },
		{ label: "Person 3", value: "EF" }
	],
	label: "Select User",
	message: "Helper Text",
	placeholder: "Select favourite user"
} as SelectProps;