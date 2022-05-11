import React, { ReactNode } from "react";
import { getClassname } from "../utils";

export interface FlexProps {
	className?: string;
	expand?: boolean;
	justify?: "center" | "start" | "end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "start" | "end" | "baseline" | "stretch";
	direction?: "row" | "col" | "col-reverse" | "row-reverse";
	wrap?: boolean;
	children: ReactNode;
}

export const Flex = function ( props: FlexProps ) {
	const baseClassName = getClassname( "flex-root", {
		justify: props.justify || "start",
		align: props.align || "start",
		direction: props.direction || "row",
		expand: props.expand || false,
		wrap: props.wrap || false
	} );

	return (
		<div className={ baseClassName + ` ${ props.className }` }>{ props.children }</div>
	);
};










