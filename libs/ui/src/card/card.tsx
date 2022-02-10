import styled from "styled-components";
import { theme } from "../utils";

export interface CardProps {
	title?: string;
	content?: string;
	centered?: boolean;
	image?: string;
	// actions?: ButtonProps[];
}

const CardWrapper = styled.div<CardProps>`
	width: fit-content;
	border-style: solid;
	border-width: 2px;
	padding: 20px;
	border-radius: 8px;
	background: ${ theme.colors.default[ 200 ] };
	border-color: ${ theme.colors.default[ 400 ] };
	text-align: ${ ( { centered } ) => centered!! ? "center" : "left" };
	box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;

const CardTitle = styled.h2`
	font-family: ${ theme.fontFamily.montserrat };
	font-weight: bold;
	font-size: 24px;
	margin: 0px;
	margin-top: 8px;
`;

const CardContent = styled.p`
	margin: 0px;
	margin-top: 8px;
	font-size: 16px;
	font-family: ${ theme.fontFamily.montserrat };
`;

export default function Card( props: CardProps ) {
	return (
		<CardWrapper>
			{ props.image && <img src={ props.image } alt="" width={ 100 } height={ 100 }/> }
			<CardTitle>{ props.title }</CardTitle>
			<CardContent>{ props.content }</CardContent>
		</CardWrapper>
	);
}