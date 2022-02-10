import * as trpc from "@trpc/server";
import { createUserInput, createUserResolver } from "./create-user";
import { verifyUserInput, verifyUserResolver } from "./verify-user";
import { TrpcContext } from "@s2h/utils/trpc";
import { loginInput, loginResolver } from "./login";

export * from "./google-auth";

export const usersRouter = trpc.router<TrpcContext>()
	.mutation( "create-user", { input: createUserInput, resolve: createUserResolver } )
	.mutation( "verify-user", { input: verifyUserInput, resolve: verifyUserResolver } )
	.mutation( "login", { input: loginInput, resolve: loginResolver } );