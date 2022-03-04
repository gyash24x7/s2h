import { createReactQueryHooks } from "@trpc/react";
import type { LiteratureRouter } from "@s2h/routers/literature";
import { QueryClient, QueryClientProvider } from "react-query";
import type { FC } from "react";
import React from "react";
import { splitLink } from "@trpc/client/links/splitLink";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpLink } from "@trpc/client/links/httpLink";

export const trpc = createReactQueryHooks<LiteratureRouter>();

const wsClient = createWSClient( {
	url: `ws://localhost:8000`
} );

const trpcClient = trpc.createClient( {
	fetch: ( input, init ) => fetch( input, { ...init, credentials: "include" } ),
	links: [
		splitLink( {
			condition( op ) {
				return op.type === "subscription";
			},
			true: wsLink( { client: wsClient } ),
			false: httpLink( { url: `http://localhost:8000/api/trpc` } )
		} )
	]
} );

const queryClient = new QueryClient( {
	defaultOptions: {
		queries: { refetchOnWindowFocus: false, retry: false }
	}
} );

export const TrpcProvider: FC = function ( props ) {
	return (
		<trpc.Provider queryClient={ queryClient } client={ trpcClient }>
			<QueryClientProvider client={ queryClient }>
				{ props.children }
			</QueryClientProvider>
		</trpc.Provider>
	);
};