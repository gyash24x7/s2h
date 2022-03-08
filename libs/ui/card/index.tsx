import React, { ReactNode } from "react";

export interface CardProps {
	title: string;
	content: ReactNode;
}

export function Card( props: CardProps ) {
	return (
		<div className={ "card-root" }>
			<h2 className={ "card-title" }>{ props.title }</h2>
			{ props.content }
		</div>
	);
}