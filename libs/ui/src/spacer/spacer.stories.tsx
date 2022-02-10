import { Meta, Story } from "@storybook/react";
import Spacer, { SpacerProps } from "./spacer";
import Flex from "../flex";

export default {
	component: Spacer,
	title: "Spacer"
} as Meta<SpacerProps>;

const Template: Story<SpacerProps> = () => (
	<Flex>
		<div style={ { background: "#dfe1e6", padding: 20 } }>Flex Child 1</div>
		<Spacer/>
		<div style={ { background: "#c1c7d0", padding: 20 } }>Flex Child 2</div>
		<Spacer/>
		<div style={ { background: "#808080", padding: 20 } }>Flex Child 3</div>
	</Flex>
);

export const Basic = Template.bind( {} );
Basic.args = {} as SpacerProps;