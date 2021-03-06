import { createReactQueryHooks } from "@trpc/react";
import type { LiteratureRouter } from "@s2h/routers/literature";
import { QueryClient, QueryClientProvider } from "react-query";
import type { FC } from "react";
import React from "react";

export const trpc = createReactQueryHooks<LiteratureRouter>();

export const trpcClient = trpc.createClient( {
	url: "http://localhost:8000/api/literature",
	fetch: ( input, init ) => fetch( input, { ...init, credentials: "include" } )
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