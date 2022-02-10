import styled from "styled-components";
import Box from "@s2h/ui/box";

export interface SpacerProps {
	minWidth?: number;
}

const Spacer = styled( Box )<SpacerProps>`
	flex: 1;
	minWidth: ${ ( { minWidth } ) => minWidth || "unset" }
`;

export default Spacer;