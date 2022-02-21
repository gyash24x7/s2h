import React, { Fragment } from "react";
import { InputMessage } from "../input-message";
import { getClassname } from "../utils";

export interface TextAreaProps {
	label?: string;
	name: string;
	placeholder?: string;
	message?: string;
	rows?: number;
	value?: string;
	onChange?: ( value: string ) => void | Promise<void>;
	appearance?: "default" | "danger" | "success";
}

export function TextArea( props: TextAreaProps ) {
	return (
		<Fragment>
			{ props.label && <label className={ "label-root" } htmlFor={ props.name }>{ props.label }</label> }
			<div
				className={ getClassname(
					"input-root",
					{ valid: props.appearance === "success", invalid: props.appearance === "danger" }
				) }
			>
				<textarea
					name={ props.name }
					rows={ props.rows || 3 }
					placeholder={ props.placeholder || "" }
					value={ props.value }
					onChange={ e => props.onChange && props.onChange( e.target.value ) }
				/>
			</div>
			{ props.message && <InputMessage text={ props.message } appearance={ props.appearance }/> }
		</Fragment>
	);
}