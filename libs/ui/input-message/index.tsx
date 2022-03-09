import React, { Fragment } from "react";
import { getClassname } from "../utils";
import { HStack } from "../stack";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";

export interface InputMessageProps {
	appearance?: "default" | "danger" | "success";
	text: string;
}

export function InputMessage( { appearance, text }: InputMessageProps ) {
	const Icon = appearance === "success" ? CheckCircleIcon : appearance === "danger"
		? ExclamationCircleIcon
		: undefined;
	return (
		<div
			className={ getClassname(
				"input-message-root",
				{ valid: appearance === "success", invalid: appearance === "danger" }
			) }
		>
			<HStack spacing={ "xs" }>
				{ Icon && <Icon className={ "input-message-icon" }/> }
				<Fragment>{ text }</Fragment>
			</HStack>
		</div>
	);
}