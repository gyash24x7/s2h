import { getClassname, Size } from "../utils";
import React, { Children, FC, Fragment, isValidElement, ReactElement, ReactNode } from "react";
import { Flex } from "../flex";

export interface StackProps {
	orientation?: "horizontal" | "vertical";
	align?: "center" | "start" | "end" | "baseline" | "stretch";
	spacing?: Size;
	centered?: boolean;
}

function getValidChildren( children: ReactNode ) {
	return Children.toArray( children ).filter( ( child ) => isValidElement( child ) ) as ReactElement[];
}

export const Stack: FC<StackProps> = function ( { orientation, centered, children, spacing, align } ) {
	const validChildren = getValidChildren( children );
	return (
		<Flex
			direction={ orientation === "vertical" ? "col" : "row" }
			justify={ centered ? "center" : "start" }
			align={ align }
		>
			{ validChildren.map( ( child, index ) => (
				<Fragment key={ child.key }>
					{ child }
					{ validChildren.length !== index + 1 && (
						<div className={ getClassname( "stack-space", { size: spacing || "md" } ) }/>
					) }
				</Fragment>
			) ) }
		</Flex>
	);
};