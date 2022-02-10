import Avatar, { AvatarProps } from "./avatar";
import { Meta, Story } from "@storybook/react";

export default {
	component: Avatar,
	title: "Avatar",
	argTypes: {
		size: {
			description: "Sets the size of the avatar",
			options: [ "small", "medium", "large" ] as Array<AvatarProps["size"]>,
			control: { type: "inline-radio" },
			defaultValue: "medium"
		},
		src: {
			description: "Sets the image to be shown as avatar"
		}
	}
} as Meta<AvatarProps>;

const Template: Story<AvatarProps> = ( args ) => <Avatar { ...args }/>;

export const Basic = Template.bind( {} );
Basic.args = {
	src: "https://avatars.dicebear.com/api/adventurer-neutral/somrandomstring.svg?radius=50"
} as AvatarProps;