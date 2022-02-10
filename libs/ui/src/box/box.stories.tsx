import Box, { BoxProps } from "./box";
import { Meta, Story } from "@storybook/react";

export default { component: Box, title: "Box" } as Meta;

const Template: Story<BoxProps> = ( args ) => <Box { ...args }/>;

export const Primary = Template.bind( {} );
Primary.args = {
	children: <div>Child</div>
};