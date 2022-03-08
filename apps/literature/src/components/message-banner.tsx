import { Spinner } from "@s2h/ui/spinner";
import { Stack } from "@s2h/ui/stack";
import React from "react";
import type { Appearance } from "@s2h/ui/utils";

export interface MessageBannerProps {
	message: string;
	appearance?: Appearance;
}

export const MessageBanner = function ( props: MessageBannerProps ) {
	return (
		<Stack
			className={ "p-5 bg-light-300 rounded-md w-full border border-light-700" }
			align={ "center" }
		>
			<Spinner appearance={ props.appearance || "primary" }/>
			<h2>{ props.message }</h2>
		</Stack>
	);
};