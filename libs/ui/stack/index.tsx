import { getClassname, Size } from "../utils";
import React, { Children, FC, isValidElement, ReactElement, ReactNode } from "react";
import { Flex } from "../flex";

interface BaseStackProps {
	spacing?: Size;
	className?: string;
	centered?: boolean;
	stackItemClassName?: string;
}

export interface VStackProps extends BaseStackProps {
}

export interface HStackProps extends BaseStackProps {
	wrap?: boolean;
	stackItemExpand?: boolean;
}

function getValidChildren( children: ReactNode ) {
	return Children.toArray( children ).filter( ( child ) => isValidElement( child ) ) as ReactElement[];
}

export const HStack: FC<HStackProps> = function ( props ) {
	const validChildren = getValidChildren( props.children );
	return (
		<Flex
			justify={ props.centered ? "center" : "start" }
			align={ "center" }
			className={ `${ getClassname( "h-stack-flex", { size: props.spacing || "md" } ) } ${ props.className }` }
			wrap={ props.wrap }
		>
			{ validChildren.map( ( child ) => (
				<div
					key={ child.key }
					className={ `
						${ getClassname( "stack-item", { expand: props.stackItemExpand || false } ) }
						${ props.stackItemClassName }
					` }
				>
					{ child }
				</div>
			) ) }
		</Flex>
	);
};

export const VStack: FC<VStackProps> = function ( props ) {
	const validChildren = getValidChildren( props.children );
	return (
		<div className={ `${ getClassname( "v-stack-flex", { size: props.spacing || "md" } ) } ${ props.className }` }>
			{ validChildren.map( ( child ) => (
				<div
					key={ child.key }
					className={ getClassname( "stack-item", { centered: props.centered || false } ) }
				>
					{ child }
				</div>
			) ) }
		</div>
	);
};