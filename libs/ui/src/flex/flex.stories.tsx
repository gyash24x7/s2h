import { Meta, Story } from "@storybook/react";
import Flex, { FlexProps } from "./flex";

export default {
	component: Flex,
	subcomponents: {},
	title: "Flex",
	argTypes: {
		direction: {
			description: "Sets the axis of flex",
			options: [ "row", "column", "column-reverse", "row-reverse" ] as Array<FlexProps["direction"]>,
			control: { type: "inline-radio" },
			defaultValue: "row"
		},
		justify: {
			description: "Sets the distribution of child elements on the flex axis",
			options: [
				"flex-start",
				"flex-end",
				"center",
				"space-between",
				"space-around",
				"space-evenly"
			] as Array<FlexProps["justify"]>,
			control: { type: "inline-radio" },
			defaultValue: "flex-start"
		},
		align: {
			description: "Sets the distribution of child elements perpendicular to the flex axis",
			options: [
				"flex-start",
				"flex-end",
				"center",
				"space-between",
				"space-around",
				"space-evenly"
			] as Array<FlexProps["align"]>,
			control: { type: "inline-radio" },
			defaultValue: "flex-start"
		}
	}
} as Meta<FlexProps>;

const Template: Story<FlexProps> = ( args ) => (
	<Flex { ...args }>
		<div style={ { background: "#dfe1e6", padding: 20 } }>Flex Child 1</div>
		<div style={ { background: "#c1c7d0", padding: 20 } }>Flex Child 2</div>
		<div style={ { background: "#808080", padding: 20 } }>Flex Child 3</div>
	</Flex>
);

export const Basic = Template.bind( {} );
Basic.args = {} as FlexProps;