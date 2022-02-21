import { Meta, Story } from "@storybook/react";
import { Spinner, SpinnerProps } from "@s2h/ui/spinner";
import { Appearance, Size } from "@s2h/ui/utils";

export default {
	component: Spinner,
	title: "Spinner",
	argTypes: {
		appearance: {
			options: [ "primary", "default", "danger", "info", "alt", "warning", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "default",
			description: "Sets the appearance of the spinner"
		},
		size: {
			options: [ "xs", "sm", "md", "lg", "xl", "2xl" ] as Size[],
			control: { type: "inline-radio" },
			description: "Sets the size of the spinner",
			defaultValue: "medium"
		}
	}
} as Meta<SpinnerProps>;

const Template: Story<SpinnerProps> = ( args ) => <Spinner { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { size: "md" };