import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "@s2h/routers";
import { QueryClient, QueryClientProvider } from "react-query";
import type { FC } from "react";
import React from "react";

export const trpc = createReactQueryHooks<AppRouter>();

const trpcClient = trpc.createClient( {
	url: "http://localhost:8010/proxy/trpc"
} );

const queryClient = new QueryClient();

export const TrpcProvider: FC = function ( props ) {
	return (
		<trpc.Provider queryClient={ queryClient } client={ trpcClient }>
			<QueryClientProvider client={ queryClient }>
				{ props.children }
			</QueryClientProvider>
		</trpc.Provider>
	);
};