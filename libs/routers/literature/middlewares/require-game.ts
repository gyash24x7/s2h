import { getGameInputStruct } from "@s2h/dtos";
import { Messages, TrpcMiddleware } from "@s2h/utils";
import { TRPCError } from "@trpc/server";

const requireGame: TrpcMiddleware = async function ( { ctx, rawInput, next } ) {
	const [ error, input ] = getGameInputStruct.validate( rawInput );

	if ( !!error || !input ) {
		console.error( error );
		throw new TRPCError( { code: "BAD_REQUEST", message: "Invalid Game ID!" } );
	}

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	ctx.res!.locals.currentGame = game;
	return next();
};

export default requireGame;