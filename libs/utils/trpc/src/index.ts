import type { Request, Response } from "express";
import type { PrismaClient } from "@s2h/prisma";
import type { ProcedureResolver } from "@trpc/server/src/internals/procedure";

export type TrpcContext = {
	req: Request;
	res: Response;
	session?: any;
	prisma: PrismaClient
}

export type TrpcResolver<I = any, R = any> = ProcedureResolver<TrpcContext, I, R>;

export type ExpressResolver = ( prisma: PrismaClient ) => ( req: Request, res: Response ) => void | Promise<void>