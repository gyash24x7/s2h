import { Meta, Story } from "@storybook/react";
import Stack, { StackProps } from "./stack";

export default {
	component: Stack,
	title: "Stack",
	argTypes: {
		orientation: {
			options: [ "horizontal", "vertical" ] as Array<StackProps["orientation"]>,
			control: { type: "inline-radio" },
			description: "Sets the orientation of the Stack",
			defaultValue: "horizontal"
		},
		spacing: {
			options: [ "small", "medium", "large" ] as Array<StackProps["spacing"]>,
			control: { type: "inline-radio" },
			description: "Sets the spacing between the stack elements",
			defaultValue: "small"
		},
		centered: {
			description: "Moves the stack to the center of parent",
			defaultValue: false,
			control: { type: "boolean" }
		}
	}
} as Meta<StackProps>;

const Template: Story<StackProps> = args => (
	<Stack { ...args }>
		<div style={ { background: "#dfe1e6", padding: 20 } }>Stack Child 1</div>
		<div style={ { background: "#c1c7d0", padding: 20 } }>Stack Child 2</div>
		<div style={ { background: "#808080", padding: 20 } }>Stack Child 3</div>
	</Stack>
);

export const Basic = Template.bind( {} );
Basic.args = {};