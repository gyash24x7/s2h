import type { LitGame, PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { Namespace } from "socket.io";
import type { MiddlewareFunction } from "@trpc/server/dist/declarations/src/internals/middlewares";

export type TrpcContext = {
	req?: Request;
	res?: Response;
	prisma: PrismaClient;
	namespace?: Namespace;
}

export type TrpcMiddleware = MiddlewareFunction<TrpcContext, TrpcContext>

export type TrpcResolverOptions<I = any> = {
	input: I;
	ctx: TrpcContext;
}

export type TrpcResolver<I = any, R = any> = ( options: TrpcResolverOptions<I> ) => R | Promise<R>

export type LitResolver<I = unknown> = TrpcResolver<I, LitGame>;

export type ExpressMiddleware = ( req: Request, res: Response, next: NextFunction ) => any | Promise<any>

export type ExpressHandler = ( req: Request, res: Response ) => any | Promise<any>

export type GoogleTokenResult = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	id_token: string;
}

export type GoogleUserResult = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}