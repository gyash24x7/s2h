import { Meta, Story } from "@storybook/react";
import { RadioSelect, RadioSelectProps } from "@s2h/ui/radio-select";
import { Avatar } from "@s2h/ui/avatar";
import { useState } from "react";

export default {
	component: RadioSelect,
	title: "Radio Select"
} as Meta<RadioSelectProps<string>>;

const RadioSelectStateful = ( props: { options: string[], renderOption: RadioSelectProps<string>["renderOption"] } ) => {
	const [ value, setValue ] = useState( props.options[ 0 ] );
	return <RadioSelect { ...props } value={ value } onChange={ setValue }/>;
};

const Template: Story<RadioSelectProps<string>> = ( args ) => {
	return <RadioSelectStateful { ...args }/>;
};

export const Playground = Template.bind( {} );
Playground.args = {
	options: [ "Option A", "Option B", "Option C" ],
	renderOption: ( option, _checked ) => <Avatar name={ option }/>
} as RadioSelectProps<string>;
