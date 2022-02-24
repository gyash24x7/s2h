import type { PrismaClient } from "@s2h/prisma";
import type { Session } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

export type TrpcContext = {
	req: NextApiRequest;
	res: NextApiResponse;
	session?: Session | null;
	prisma: PrismaClient
}

export type TrpcResolverOptions<I = any> = {
	input: I;
	ctx: TrpcContext;
}

export type TrpcResolver<I = any, R = any> = ( options: TrpcResolverOptions<I> ) => R | Promise<R>