import { HTMLAttributes } from "react";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {}

export default function Box( { children, ...rest }: BoxProps ) {
	return (
		<div { ...rest }>
			{ children }
		</div>
	);
};
