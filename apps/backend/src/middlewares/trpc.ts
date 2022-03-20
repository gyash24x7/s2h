import { CreateExpressContextOptions, createExpressMiddleware } from "@trpc/server/adapters/express";
import type { ExpressMiddleware, TrpcContext } from "@s2h/utils";
import prisma from "../utils/prisma";
import { literatureRouter as router } from "@s2h/routers";
import type { Namespace } from "socket.io";

export function createContextFactory( namespace: Namespace ) {
	return function ( { req, res }: CreateExpressContextOptions ): TrpcContext {
		return { req, res, prisma, namespace };
	};
}

const handleTrpc = function ( namespace: Namespace ): ExpressMiddleware {
	return createExpressMiddleware( { router, createContext: createContextFactory( namespace ) } );
};

export default handleTrpc;