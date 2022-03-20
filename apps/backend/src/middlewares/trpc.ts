import { CreateExpressContextOptions, createExpressMiddleware } from "@trpc/server/adapters/express";
import type { ExpressMiddleware, TrpcContext } from "@s2h/utils";
import prisma from "../utils/prisma";
import { literatureRouter as router } from "@s2h/routers";
import ee from "../utils/events";

export function createContext( { req, res }: CreateExpressContextOptions ): TrpcContext {
	return { req, res, prisma, ee };
}

const handleTrpc: ExpressMiddleware = createExpressMiddleware( { router, createContext } );

export default handleTrpc;