import React, { Fragment } from "react";
import { getClassname } from "../utils";
import { InputMessage } from "../input-message";
import { Flex } from "../flex";

export interface RadioProps {
	name: string;
	label?: string;
	options: string[];
	value: string;
	onChange: ( value: string ) => void | Promise<void>;
	appearance?: "default" | "success" | "danger";
	message?: string;
}

export function RadioGroup( { options, name, label, appearance, message }: RadioProps ) {
	return (
		<Fragment>
			{ label && <label className={ "label-root" } htmlFor={ name }>{ label }</label> }
			<Flex>
				{ options.map( option => (
					<div
						className={ getClassname(
							"radio-root",
							{ valid: appearance === "success", invalid: appearance === "danger" }
						) }
					>
						<input type={ "radio" } name={ name }/>
						<label htmlFor={ name }>{ option }</label>
					</div>
				) ) }
			</Flex>
			{ message && <InputMessage text={ message } appearance={ appearance }/> }
		</Fragment>
	);
}