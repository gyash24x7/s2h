import React, { ReactNode } from "react";
import { RadioGroup } from "@headlessui/react";
import { HStack } from "../stack";
import { getClassname } from "../utils";

export interface SingleSelectProps<T> {
	value?: T;
	onChange: ( v: T ) => void | Promise<void>;
	options: T[];
	renderOption: ( option: T, checked: boolean ) => ReactNode;
}

export function SingleSelect<T>( props: SingleSelectProps<T> ) {
	return (
		<RadioGroup value={ props.value } onChange={ props.onChange }>
			<HStack wrap spacing={ "xs" }>
				{ props.options.map( ( option, index ) => (
					<RadioGroup.Option
						value={ option }
						key={ index }
						className={ ( { checked } ) => getClassname( "radio-select-option", { checked } ) }
					>
						{ ( { checked } ) => props.renderOption( option, checked ) }
					</RadioGroup.Option>
				) ) }
			</HStack>
		</RadioGroup>
	);
}