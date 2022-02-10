import * as trpc from "@trpc/server";
import type { TrpcContext } from "@s2h/utils/trpc";
import { usersRouter } from "@s2h/routers/users";
import { literatureRouter } from "@s2h/routers/literature";
import type { PrismaClient } from "@s2h/prisma";
import { CreateExpressContextOptions, createExpressMiddleware } from "@trpc/server/adapters/express";

const router = trpc.router<TrpcContext>().merge( usersRouter ).merge( literatureRouter );

export type AppRouter = typeof router;

const createContextFnFactory = ( prisma: PrismaClient ) => ( { req, res }: CreateExpressContextOptions ) => {
	return { req, res, prisma };
};

export function createTrpcMiddleware( prisma: PrismaClient ) {
	return createExpressMiddleware<AppRouter>( { router, createContext: createContextFnFactory( prisma ) } );
}