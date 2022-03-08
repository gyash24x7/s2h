import { getClassname, Size } from "../utils";
import React, { Children, FC, isValidElement, ReactElement, ReactNode } from "react";
import { Flex } from "../flex";

export interface StackProps {
	orientation?: "horizontal" | "vertical";
	align?: "center" | "start" | "end" | "baseline" | "stretch";
	spacing?: Size;
	centered?: boolean;
	wrap?: boolean;
	className?: string;
}

function getValidChildren( children: ReactNode ) {
	return Children.toArray( children ).filter( ( child ) => isValidElement( child ) ) as ReactElement[];
}

export const Stack: FC<StackProps> = function ( props ) {
	const validChildren = getValidChildren( props.children );
	return (
		<Flex
			direction={ props.orientation === "vertical" ? "col" : "row" }
			justify={ props.centered ? "center" : "start" }
			align={ props.align }
			className={ `${ getClassname( "stack-flex", { size: props.spacing || "md" } ) } ${ props.className }` }
			wrap={ props.wrap }
		>
			{ validChildren.map( ( child ) => (
				<div key={ child.key } className={ "stack-item" }>
					{ child }
				</div>
			) ) }
		</Flex>
	);
};