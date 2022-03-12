import React, { ReactNode } from "react";
import { getClassname } from "../utils";

export interface CardProps {
	title?: string;
	content: ReactNode;
	centered?: boolean;
}

export function Card( props: CardProps ) {
	return (
		<div className={ getClassname( "card-root", { centered: props.centered || false } ) }>
			{ !!props.title && <h2 className={ "card-title" }>{ props.title }</h2> }
			{ props.content }
		</div>
	);
}