import { Appearance, getClassname, Size } from "../utils";
import React from "react";

export interface SpinnerProps {
	size?: Size;
	appearance?: Appearance | "dark";
}

export function Spinner( props: SpinnerProps ) {
	return (
		<svg
			viewBox="0 0 50 50"
			className={ getClassname( "spinner-root", {
				size: props.size || "md",
				appearance: props.appearance || "default"
			} ) }
		>
			<circle cx={ 25 } cy={ 25 } r={ 20 }/>
		</svg>
	);
}