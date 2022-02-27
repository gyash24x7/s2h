import type { TrpcResolver } from "@s2h/utils";
import { getCardString } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { AskCardInput, GameResponse } from "@s2h/dtos";

export const askCardResolver: TrpcResolver<AskCardInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game Not Found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const updatedGame = await ctx.prisma.litGame.update( {
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

	return { data: updatedGame };
};