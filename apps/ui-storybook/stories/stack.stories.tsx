import { Meta, Story } from "@storybook/react";
import { Stack, StackProps } from "@s2h/ui/stack";

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
			options: [ "xs", "sm", "md", "lg", "xl", "2xl" ],
			control: { type: "inline-radio" },
			description: "Sets the spacing between the stack elements",
			defaultValue: "sm"
		},
		centered: {
			description: "Moves the stack to the center of parent",
			defaultValue: false,
			control: { type: "boolean" }
		},
		align: {
			description: "Sets the distribution of child elements perpendicular to the flex axis",
			options: [ "start", "end", "center", "baseline", "stretch" ],
			control: { type: "inline-radio" },
			defaultValue: "start"
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

export const Playground = Template.bind( {} );
Playground.args = {};