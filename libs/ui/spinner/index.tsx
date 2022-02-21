import { Appearance, getClassname, Size } from "../utils";
import React from "react";

export interface SpinnerProps {
	size?: Size;
	appearance?: Appearance;
}

export function Spinner( { size = "md", appearance = "default" }: SpinnerProps ) {
	return (
		<svg viewBox="0 0 50 50" className={ getClassname( "spinner-root", { size, appearance } ) }>
			<circle cx={ 25 } cy={ 25 } r={ 20 } />
		</svg>
	);
}