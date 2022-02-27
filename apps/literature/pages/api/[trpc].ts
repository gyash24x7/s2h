import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import * as trpcNext from "@trpc/server/adapters/next";
import type { LiteratureRouter } from "@s2h/routers/literature";
import { literatureRouter as router } from "@s2h/routers";
import { getSession } from "next-auth/react";
import type { TrpcContext } from "@s2h/utils";
import { prisma } from "utils/prisma";

async function createContext( { req, res }: CreateNextContextOptions ): Promise<TrpcContext> {
	const session = await getSession( { req } );
	return { session, res, req, prisma };
}

export default trpcNext.createNextApiHandler<LiteratureRouter>( { router, createContext } );