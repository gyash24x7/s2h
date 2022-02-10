import { Meta, Story } from "@storybook/react";
import Card, { CardProps } from "./card";

export default {
	component: Card,
	title: "Card",
	argTypes: {
		title: {
			description: "Title of the card"
		},
		content: {
			description: "Content of the card"
		},
		image: {
			description: "Image to be shown in card"
		},
		centered: {
			description: "Sets the card title and content in center",
			control: { type: "boolean" },
			defaultValue: false
		}
	}
} as Meta<CardProps>;

const Template: Story<CardProps> = args => <Card { ...args }/>;

export const Basic = Template.bind( {} );
Basic.args = {
	title: "Card Title",
	content: "Card Content",
	image: "https://avatars.dicebear.com/api/adventurer-neutral/somrandomstring.svg?radius=50"
} as CardProps;