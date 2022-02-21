import { Meta, Story } from "@storybook/react";
import { Checkbox, CheckboxProps } from "@s2h/ui/checkbox";

export default {
	component: Checkbox,
	title: "Checkbox",
	argTypes: {}
} as Meta<CheckboxProps>;

const Template: Story<CheckboxProps> = args => <Checkbox { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { label: "By the way", name: "rememberMe" } as CheckboxProps;