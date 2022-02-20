import { Avatar, AvatarProps } from "@s2h/ui/avatar";
import { Meta, Story } from "@storybook/react";

export default {
	component: Avatar,
	title: "Avatar",
	argTypes: {
		size: {
			description: "Sets the size of the avatar",
			options: [ "xs", "sm", "md", "lg", "xl", "2xl" ],
			control: { type: "inline-radio" },
			defaultValue: "medium"
		},
		src: {
			description: "Sets the image to be shown as avatar"
		}
	}
} as Meta<AvatarProps>;

const Template: Story<AvatarProps> = ( args ) => <Avatar { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { size: "md", name: "Yash Gupta" } as AvatarProps;