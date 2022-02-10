import { Meta, Story } from "@storybook/react";
import Spinner, { SpinnerProps } from "./spinner";
import { Appearance } from "../utils";

export default {
	component: Spinner,
	title: "Spinner",
	argTypes: {
		appearance: {
			options: [ "primary", "default", "dark", "danger", "info", "alt", "warning", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "primary",
			description: "Sets the appearance of the spinner"
		},
		size: {
			options: [ "small", "medium", "large" ] as Array<SpinnerProps["size"]>,
			control: { type: "inline-radio" },
			description: "Sets the size of the spinner",
			defaultValue: "medium"
		}
	}
} as Meta<SpinnerProps>;

const Template: Story<SpinnerProps> = ( args ) => <Spinner { ...args }/>;

export const Basic = Template.bind( {} );
Basic.args = {};