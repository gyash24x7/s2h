import * as trpc from "@trpc/server";
import { createUserResolver } from "./create-user";
import { verifyUserResolver } from "./verify-user";
import type { TrpcContext } from "@s2h/utils";
import { loginResolver } from "./login";
import { createUserInputStruct, loginInputStruct, verifyUserInputStruct } from "@s2h/dtos";

export * from "./google-auth";

export const usersRouter = trpc.router<TrpcContext>()
	.mutation( "create-user", { input: createUserInputStruct, resolve: createUserResolver } )
	.mutation( "verify-user", { input: verifyUserInputStruct, resolve: verifyUserResolver } )
	.mutation( "login", { input: loginInputStruct, resolve: loginResolver } );