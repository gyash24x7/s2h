import { getCardString, Messages } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { AskCardInput } from "@s2h/dtos";
import type { LitResolver } from "./index";
import { TRPCError } from "@trpc/server";

export const askCardResolver: LitResolver<AskCardInput> = async ( { input, ctx } ) => {
	const loggedInUserEmail = ctx.session?.user?.email!;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const loggedInPlayer = game.players.find( player => player.userEmail === loggedInUserEmail );

	if ( !loggedInPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	return ctx.prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				create: [
					{
						askedFrom: { connect: { id: input.askedFrom } },
						type: LitMoveType.ASK,
						askedFor: getCardString( input.askedFor ),
						askedBy: { connect: { id: loggedInPlayer.id } }
					}
				]
			}
		}
	} );
};