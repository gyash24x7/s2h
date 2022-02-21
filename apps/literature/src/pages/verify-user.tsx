import { trpc } from "../utils/trpc";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMount } from "react-use";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import React from "react";

export function VerifyUser() {
	const navigate = useNavigate();
	const [ searchParams ] = useSearchParams();

	const { mutateAsync } = trpc.useMutation( [ "verify-user" ], {
		async onSettled() {
			await navigate( "/login" );
		}
	} );

	useMount( async () => {
		await mutateAsync( { token: searchParams.get( "token" )! } );
	} );

	return (
		<Flex expand justify={ "center" } align={ "center" }>
			<Spinner size="lg"/>
		</Flex>
	);
}