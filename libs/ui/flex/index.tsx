import React, { FC } from "react";
import { getClassname } from "../utils";

export interface FlexProps {
	className?: string;
	expand?: boolean;
	justify?: "center" | "start" | "end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "start" | "end" | "baseline" | "stretch";
	direction?: "row" | "col" | "col-reverse" | "row-reverse";
}

export const Flex: FC<FlexProps> = function ( props ) {
	const { justify = "start", align = "start", direction = "row", expand = false, children } = props;
	return (
		<div className={ getClassname( "flex-root", { justify, align, direction, expand } ) + ` ${ props.className }` }>
			{ children }
		</div>
	);
};










