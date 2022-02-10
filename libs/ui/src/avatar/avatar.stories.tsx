import Avatar, { AvatarProps } from "./avatar";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default { component: Avatar, title: "Avatar" } as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = ( args ) => <Avatar { ...args }/>;

export const Default = Template.bind( {} );
Default.args = {
	src: "https://avatars.dicebear.com/api/adventurer-neutral/somrandomstring.svg?radius=50"
} as AvatarProps;

export const Small = Template.bind( {} );
Small.args = {
	size: "small",
	src: "https://avatars.dicebear.com/api/adventurer-neutral/somrandomstring.svg?radius=50"
} as AvatarProps;

export const Large = Template.bind( {} );
Large.args = {
	src: "https://avatars.dicebear.com/api/adventurer-neutral/somrandomstring.svg?radius=50",
	size: "large"
} as AvatarProps;