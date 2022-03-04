import type { LitGame, LitMove, LitPlayer, LitTeam, PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export type TrpcContext = {
	req: Request;
	res: Response;
	prisma: PrismaClient
}

export type TrpcResolverOptions<I = any> = {
	input: I;
	ctx: TrpcContext;
}

export type TrpcResolver<I = any, R = any> = ( options: TrpcResolverOptions<I> ) => R | Promise<R>

export type LitGameData = LitGame & { players: LitPlayer[] } & { teams: LitTeam[] } & { moves: LitMove[] }

export type LitResolver<I = unknown> = TrpcResolver<I, LitGameData>;

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