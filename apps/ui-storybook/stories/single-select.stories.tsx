import { Meta, Story } from "@storybook/react";
import { SingleSelect, SingleSelectProps } from "@s2h/ui/select";
import { Avatar } from "@s2h/ui/avatar";
import { useState } from "react";

export default {
	component: SingleSelect,
	title: "Radio Select"
} as Meta<SingleSelectProps<string>>;

const SingleSelectStateful = ( props: { options: string[], renderOption: SingleSelectProps<string>["renderOption"] } ) => {
	const [ value, setValue ] = useState( props.options[ 0 ] );
	return <SingleSelect { ...props } value={ value } onChange={ setValue }/>;
};

const Template: Story<SingleSelectProps<string>> = ( args ) => {
	return <SingleSelectStateful { ...args }/>;
};

export const Playground = Template.bind( {} );
Playground.args = {
	options: [ "Option A", "Option B", "Option C" ],
	renderOption: ( option, _checked ) => <Avatar name={ option }/>
} as SingleSelectProps<string>;
