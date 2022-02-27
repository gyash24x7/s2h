import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { LiteratureRouter } from "@s2h/routers";
import { withTRPC } from "@trpc/next";

function App( { Component, pageProps: { session, ...pageProps } }: AppProps ) {
	return (
		<SessionProvider session={ session }>
			<Component { ...pageProps } />
		</SessionProvider>
	);
}

export default withTRPC<LiteratureRouter>( {
	config: () => (
		{ url: "http://localhost:3000/api" }
	),
	ssr: true
} )( App );
