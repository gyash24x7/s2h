import { Appearance, getClassname, getIconWidthHeightFromSize, IconType, Size } from "../utils";
import React from "react";
import { Spinner } from "../spinner";
import { Stack } from "../stack";

export interface ButtonProps {
	type?: "submit" | "reset";
	onClick?: () => any | Promise<any>;

	size?: Size;
	fullWidth?: boolean;
	appearance?: Appearance;

	buttonText?: string;
	isLoading?: boolean;
	iconBefore?: IconType;
	iconAfter?: IconType;
}

function renderButtonIcon( Icon: IconType, size: Size = "md" ) {
	const { width, height } = getIconWidthHeightFromSize( size );
	return <Icon width={ width } height={ height }/>;
}

export function Button( props: ButtonProps ) {
	return (
		<button
			onClick={ props.onClick }
			type={ props.type }
			className={ getClassname( "button-root", {
				appearance: props.appearance || "primary",
				size: props.size || "md",
				fullWidth: props.fullWidth || false
			} ) }
		>
			{
				props.isLoading!!
					? <Spinner size={ props.size } appearance={ "default" }/>
					: (
						<Stack align={ "center" } spacing={ "sm" }>
							{ props.iconBefore && renderButtonIcon( props.iconBefore, props.size ) }
							{ props.buttonText && <span>{ props.buttonText }</span> }
							{ props.iconAfter && renderButtonIcon( props.iconAfter, props.size ) }
						</Stack>
					)
			}
		</button>
	);
}