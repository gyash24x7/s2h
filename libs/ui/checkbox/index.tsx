import React, { Fragment } from "react";
import { getClassname } from "../utils";
import { CheckIcon } from "@heroicons/react/solid";
import { InputMessage } from "../input-message";

export interface CheckboxProps {
	name: string;
	label: string;
	checked?: boolean;
	appearance?: "default" | "success" | "danger";
	message?: string;
	onChange?: ( value: boolean ) => void | Promise<void>;
}

export function Checkbox( { label, name, checked, message, appearance }: CheckboxProps ) {
	return (
		<Fragment>
			<div
				className={ getClassname(
					"checkbox-root",
					{ valid: appearance === "success", invalid: appearance === "danger" }
				) }
			>
				<input type={ "checkbox" } name={ name }/>
				{ checked && <CheckIcon className={ "check-icon" }/> }
				<label htmlFor={ name }>{ label }</label>
			</div>
			{ message && <InputMessage text={ message } appearance={ appearance }/> }
		</Fragment>
	);
}