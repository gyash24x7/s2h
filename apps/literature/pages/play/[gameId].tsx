import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { Flex } from "@s2h/ui/flex";
import { getSession } from "next-auth/react";
import { Spinner } from "@s2h/ui/spinner";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async function ( { req } ) {
	const session = await getSession( { req } );
	if ( !session ) {
		return { redirect: { destination: "/", permanent: false } };
	}

	return { props: {} };
};

export type GamePlayProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const playPage: NextPage<GamePlayProps> = function () {
	const { query } = useRouter();

	const { data, isLoading } = trpc.useQuery( [ "get-game", { gameId: query.gameId! as string } ] )

	if ( isLoading ) {
		return (
			<Flex className={ "h-screen w-screen" } align={ "center" } justify={ "center" }>
				<Spinner size={ "xl" } appearance={ "primary" }/>
			</Flex>
		);
	}

	return (
		<Flex direction={ "col" } align={ "center" }>
			<h1 className={ "text-5xl" }>LITERATURE</h1>
			<h2 className={ "text-2xl" }>{ data?.id }</h2>
			<h2 className={ "text-2xl" }>{ data?.code }</h2>
		</Flex>
	);
};

export default playPage;