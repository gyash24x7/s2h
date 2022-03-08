import { Combobox, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { CheckCircleIcon, SelectorIcon } from "@heroicons/react/solid";
import { InputMessage } from "../input-message";
import { getClassname } from "../utils";

export type SelectOption = { label: string, value: any };

export interface SelectProps {
	name: string;
	options: SelectOption[],
	label?: string;
	placeholder?: string;
	value?: SelectOption;
	onChange: ( value: SelectOption ) => void | Promise<void>;
	appearance?: "default" | "success" | "danger"
	message?: string;
}

export function Select( { options, label, name, message, appearance, placeholder, value, onChange }: SelectProps ) {
	const [ query, setQuery ] = useState( "" );

	const filteredOptions = query === "" ? options : options.filter(
		( option ) => option.label.toLowerCase().replace( /\s+/g, "" )
			.includes( query.toLowerCase().replace( /\s+/g, "" ) )
	);

	return (
		<div className={ "select-wrapper" }>
			<Combobox value={ value } onChange={ onChange }>
				{ label && <label className={ "label-root" } htmlFor={ name }>{ label }</label> }
				<div className={ "select-root" }>
					<Combobox.Input
						displayValue={ ( option: SelectOption ) => option.label }
						onChange={ ( event ) => setQuery( event.target.value ) }
						placeholder={ placeholder }
					/>
					<Combobox.Button>
						<SelectorIcon aria-hidden="true"/>
					</Combobox.Button>
				</div>
				<Transition
					as={ Fragment }
					leave={ "transition ease-in duration-100" }
					leaveFrom={ "opacity-100" }
					leaveTo={ "opacity-0" }
				>
					<Combobox.Options className={ "options-root" }>
						{ filteredOptions.length === 0 && query !== ""
							? <div className={ "no-option-match" }>Nothing found.</div>
							: filteredOptions.map( ( option ) => (
								<Combobox.Option
									key={ option.label }
									className={ ( { active } ) => getClassname( "option", { active } ) }
									value={ option }
								>
									{ ( { selected, active } ) => (
										<Fragment>
											<span className={ "option-text" }>{ option.label }</span>
											{ selected && (
												<span className={ getClassname( "option-icon", { active } ) }>
													<CheckCircleIcon className={ "w-4 h-4" } aria-hidden="true"/>
												</span>
											) }
										</Fragment>
									) }
								</Combobox.Option>
							) )
						}
					</Combobox.Options>
				</Transition>
				{ message && <InputMessage text={ message } appearance={ appearance }/> }
			</Combobox>
		</div>
	);
}