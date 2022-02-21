import type { Request, Response } from "express";
import type { PrismaClient } from "@s2h/prisma";

export type TrpcContext = {
	req: Request;
	res: Response;
	session?: any;
	prisma: PrismaClient
}

export type TrpcResolverOptions<I = any> = {
	input: I;
	ctx: TrpcContext;
}

export type TrpcResolver<I = any, R = any> = ( options: TrpcResolverOptions<I> ) => R | Promise<R>

export type ExpressResolver = ( prisma: PrismaClient ) => ( req: Request, res: Response ) => void | Promise<void>