import React, { FC } from "react";
import { getClassname } from "../utils";

export interface FlexProps {
	justify?: "center" | "start" | "end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "start" | "end" | "baseline" | "stretch";
	direction?: "row" | "col" | "col-reverse" | "row-reverse";
}

export const Flex: FC<FlexProps> = function( { justify = "start", align = "start", direction = "row", children } ) {
	return <div className={ getClassname( "flex-root", { justify, align, direction } ) }>{ children }</div>;
};










