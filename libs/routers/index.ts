import type { PrismaClient } from "@s2h/prisma";
import { CreateExpressContextOptions, createExpressMiddleware } from "@trpc/server/adapters/express";
import * as trpc from "@trpc/server";
import type { TrpcContext } from "@s2h/utils";
import { literatureRouter } from "./literature";
import { usersRouter } from "./users";

export const appRouter = trpc.router<TrpcContext>().merge( literatureRouter ).merge( usersRouter );

export type AppRouter = typeof appRouter;

export const createTrpcMiddleware = ( prisma: PrismaClient ) => createExpressMiddleware<AppRouter>( {
	router: appRouter,
	createContext( { req, res }: CreateExpressContextOptions ) {
		return { req, res, prisma };
	}
} );