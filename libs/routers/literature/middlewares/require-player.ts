import { Messages, TrpcMiddleware } from "@s2h/utils";
import type { LitGame } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const requirePlayer: TrpcMiddleware = async function ( { ctx, next } ) {
	const userId = ctx.res?.locals.userId as string;
	const game: LitGame = ctx.res?.locals.currentGame;

	const loggedInPlayer = game.players.find( player => player.userId === userId );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	ctx.res!.locals.loggedInPlayer = loggedInPlayer;
	return next();
};

export default requirePlayer;