import { Appearance, theme } from "../utils";
import Flex from "../flex/flex";
import styled, { keyframes } from "styled-components";

export interface SpinnerProps {
	size?: "small" | "medium" | "large";
	appearance?: Appearance;
}

const spinAnimation = keyframes`
	from {
    	transform: rotate(0deg);
  	}
  	to {
    	transform: rotate(360deg);
  	}
`;

const SpinnerDiv = styled.div<SpinnerProps>`
	border-style: solid;
	display: inline-block;
	width: ${ ( { size } ) => size === "large" ? "32px" : size === "small" ? "16px" : "24px" };
	height: ${ ( { size } ) => size === "large" ? "32px" : size === "small" ? "16px" : "24px" };
	border-width: ${ ( { size } ) => size === "large" ? "8px" : size === "small" ? "4px" : "6px" };
	border-color: ${ ( { appearance } ) => theme.colors[ appearance || "primary" ][ 500 ] };
	border-bottom-color: transparent;
	border-left-color: transparent;
	border-radius: 9999px;
	animation: ${ spinAnimation } 1s cubic-bezier(0, 0, 0.2, 1) infinite;
`;

export default function Spinner( props: SpinnerProps ) {
	return (
		<Flex justify={ "center" } align={ "center" }>
			<SpinnerDiv { ...props }/>
		</Flex>
	);
}