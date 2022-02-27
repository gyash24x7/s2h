import type { GetServerSideProps, NextPage } from "next";
import { Flex } from "@s2h/ui/flex";
import { Spinner } from "@s2h/ui/spinner";
import { useMount } from "react-use";
import { getSession, signOut } from "next-auth/react";

const logoutHandler: NextPage = () => {

	useMount( () => signOut() );

	return (
		<Flex expand direction={ "row" } justify={ "center" } align={ "center" } className={ "h-screen" }>
			<Spinner size={ "xxl" } appearance={ "primary" }/>
		</Flex>
	);
};

export default logoutHandler;

export const getServerSideProps: GetServerSideProps = async function ( { req } ) {
	const session = await getSession( { req } );
	if ( !session ) {
		return { redirect: { destination: "/", permanent: false } };
	}

	return { props: {} };
};
