import trpc from "@trpc/server";
import type { TrpcContext } from "@s2h/utils/trpc";
import { usersRouter } from "@s2h/routers/users";
import { literatureRouter } from "@s2h/routers/literature";

export const appRouter = trpc.router<TrpcContext>().merge( usersRouter ).merge( literatureRouter );

export type AppRouter = typeof appRouter