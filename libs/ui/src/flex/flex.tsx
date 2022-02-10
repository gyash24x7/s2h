import Box from "../box";
import styled from "styled-components";

export interface FlexProps {
	justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "flex-start" | "flex-end" | "baseline" | "stretch";
	direction?: "row" | "column" | "column-reverse" | "row-reverse";
}

export interface SpacerProps {
	minWidth?: number;
}

export const Spacer = styled( Box )<SpacerProps>`
	flex: 1;
	minWidth: ${ ( { minWidth } ) => minWidth || "unset" }
`;

const Flex = styled.div<FlexProps>`
	display: flex;
	flex-direction: ${ ( { direction } ) => direction };
	justify-content: ${ ( { justify } ) => justify };
	align-items: ${ ( { align } ) => align };
`;

export default Flex;