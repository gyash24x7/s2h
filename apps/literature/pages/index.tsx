import type { NextPage } from "next";
import { Flex } from "@s2h/ui/flex";

const Home: NextPage = () => {
	return (
		<Flex expand justify={ "center" } align={ "center" }>
			<p className={ "font-fjalla text-5xl" }>Hello Next with Stairway to Heaven UI!</p>
		</Flex>
	);
};

export default Home;
