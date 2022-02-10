import styled from "styled-components";

export interface AvatarProps {
	size?: "small" | "medium" | "large";
	src: string;
}

const AvatarImage = styled.img<AvatarProps>`
	border-radius: 9999px;
	height: ${ ( { size } ) => size === "small" ? "40px" : size === "large" ? "80px" : "60px" };
	width: ${ ( { size } ) => size === "small" ? "40px" : size === "large" ? "80px" : "60px" };
`;

export default function Avatar( props: AvatarProps ) {
	return <AvatarImage { ...props } alt="avatar"/>;
};