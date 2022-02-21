import { useNavigate } from "react-router-dom";
import { useMount } from "react-use";
import { Spinner } from "@s2h/ui/spinner";
import React from "react";
import { Flex } from "@s2h/ui/flex";

export function Home() {
	const navigate = useNavigate();

	useMount( () => navigate( "/games/literature" ) );

	return (
		<Flex justify={ "center" } expand>
			<Spinner size={ "lg" }/>
		</Flex>
	)
}