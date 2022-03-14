import { SelectOption } from "./list-select";
import React, { ReactNode } from "react";
import { HStack } from "../stack";
import { getClassname } from "../utils";

export interface MultiSelectProps<T> {
	values: SelectOption<T>[];
	onChange: ( v: SelectOption<T>[] ) => void | Promise<void>;
	options: SelectOption<T>[];
	renderOption: ( option: SelectOption<T>, checked: boolean ) => ReactNode;
}

export function MultiSelect<T>( props: MultiSelectProps<T> ) {
	const handleOptionClick = ( { label, value }: SelectOption<T> ) => () => {
		if ( isChecked( label ) ) {
			const newValues = props.values.filter( option => option.label !== label );
			props.onChange( newValues );
		} else {
			const newValues = [ ...props.values, { label, value } ];
			props.onChange( newValues );
		}
	};

	const isChecked = ( label: string ) => props.values.map( o => o.label ).includes( label );

	return (
		<HStack wrap spacing={ "xs" }>
			{ props.options.map( option => (
				<div
					key={ option.label }
					className={ getClassname( "radio-select-option", { checked: isChecked( option.label ) } ) }
					onClick={ handleOptionClick( option ) }
				>
					{ props.renderOption( option, isChecked( option.label ) ) }
				</div>
			) ) }
		</HStack>
	);
}