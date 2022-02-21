import { Meta, Story } from "@storybook/react";
import { RadioGroup, RadioProps } from "@s2h/ui/radio";

export default {
	component: RadioGroup,
	title: "Radio",
	argTypes: {}
} as Meta<RadioProps>;

const Template: Story<RadioProps> = args => <RadioGroup { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { options: [ "Option1", "Option2" ], name: "radioPlay", label: "Radio Play" } as RadioProps;