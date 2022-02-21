import { getClassname, IconType } from "../utils";
import React, { Fragment } from "react";
import { InputMessage } from "../input-message";

export interface TextInputProps {
	label?: string;
	name: string;
	placeholder?: string;
	message?: string;
	type?: "text" | "number" | "email" | "password";
	iconBefore?: IconType;
	iconAfter?: IconType;
	value?: string;
	onChange?: ( value: string ) => void | Promise<void>;
	appearance?: "default" | "danger" | "success";
}

export function TextInput( props: TextInputProps ) {
	const { iconAfter: IconAfter, iconBefore: IconBefore } = props;
	return (
		<Fragment>
			{ props.label && <label className={ "label-root" } htmlFor={ props.name }>{ props.label }</label> }
			<div
				className={ getClassname(
					"input-root",
					{ valid: props.appearance === "success", invalid: props.appearance === "danger" }
				) }
			>
				{ IconBefore!! && <IconBefore className={ "input-before-icon" }/> }
				<input
					type={ props.type || "text" }
					name={ props.name }
					placeholder={ props.placeholder }
					value={ props.value }
					onChange={ ( e: any ) => props.onChange && props.onChange( e.target.value ) }
				/>
				{ IconAfter!! && <IconAfter className={ "input-after-icon" }/> }
			</div>
			{ props.message && <InputMessage text={ props.message } appearance={ props.appearance }/> }
		</Fragment>
	);
}