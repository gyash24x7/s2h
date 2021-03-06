import { Meta, Story } from "@storybook/react";
import { Banner, BannerProps } from "@s2h/ui/banner";
import { Appearance } from "@s2h/ui/utils";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

export default {
	component: Banner,
	title: "Banner",
	argTypes: {
		icon: {
			description: "Sets the icon before the banner message"
		},
		isLoading: {
			description: "Sets loading state of the banner",
			defaultValue: false,
			control: { type: "boolean" }
		},
		message: {
			description: "Sets the message inside the banner",
			defaultValue: "This is a cool banner message",
			control: { type: "text" }
		},
		appearance: {
			options: [ "primary", "default", "danger", "info", "alt", "warning", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "default",
			description: "Sets the appearance of the banner"
		}
	}
} as Meta<BannerProps>;

const Template: Story<BannerProps> = args => <Banner { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { appearance: "default" } as BannerProps;

export const BannerWithIcon = Template.bind( {} );
BannerWithIcon.args = {
	appearance: "default",
	icon: ExclamationCircleIcon
} as BannerProps;