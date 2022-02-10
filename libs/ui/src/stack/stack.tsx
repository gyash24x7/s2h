import { Children, FC, Fragment, isValidElement, ReactElement, ReactNode } from "react";
import styled from "styled-components";
import Flex from "@s2h/ui/flex";

export interface StackProps {
	orientation?: "horizontal" | "vertical";
	spacing?: "small" | "medium" | "large";
	centered?: boolean;
}

function getValidChildren( children: ReactNode ) {
	return Children.toArray( children ).filter( ( child ) => isValidElement( child ) ) as ReactElement[];
}

const StackSpace = styled.div<StackProps>`
	width: ${ ( { spacing } ) => spacing === "medium" ? "24px" : spacing === "large" ? "48px" : "8px" };
	height: ${ ( { spacing } ) => spacing === "medium" ? "24px" : spacing === "large" ? "48px" : "8px" };
`;

const Stack: FC<StackProps> = function ( { children, ...props } ) {
	return (
		<Flex
			direction={ props.orientation === "vertical" ? "column" : "row" }
			justify={ props.centered ? "center" : "flex-start" }
		>
			{ getValidChildren( children )
				.map( child => (
					<Fragment key={ child.key }>
						{ child }
						<StackSpace { ...props }/>
					</Fragment>
				) ) }
		</Flex>
	);
};

export default Stack;