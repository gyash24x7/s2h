import type { LitResolver } from "@s2h/utils";
import { getCardString, Messages } from "@s2h/utils";
import { LitMoveType } from "@prisma/client";
import type { GiveCardInput } from "@s2h/dtos";
import { TRPCError } from "@trpc/server";

export const giveCardResolver: LitResolver<GiveCardInput> = async ( { input, ctx } ) => {
	const userId = ctx.res.locals.userId as string;

	const game = await ctx.prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		throw new TRPCError( { code: "NOT_FOUND", message: Messages.GAME_NOT_FOUND } );
	}

	const givingPlayer = game.players.find( player => player.userId === userId );

	if ( !givingPlayer ) {
		throw new TRPCError( { code: "FORBIDDEN", message: Messages.NOT_PART_OF_GAME } );
	}

	const takingPlayer = game.players.find( player => player.id === input.giveTo );

	if ( !takingPlayer ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.PLAYER_NOT_FOUND } );
	}

	const cardToGiveIndex = givingPlayer.hand.indexOf( getCardString( input.cardToGive ) );
	if ( cardToGiveIndex < 0 ) {
		throw new TRPCError( { code: "BAD_REQUEST", message: Messages.INVALID_GIVE_CARD } );
	}

	await Promise.all( [
		ctx.prisma.litPlayer.update( {
			where: { id: givingPlayer.id },
			data: { hand: { set: givingPlayer.hand.splice( cardToGiveIndex, 1 ) } }
		} ),
		ctx.prisma.litPlayer.update( {
			where: { id: takingPlayer.id },
			data: { hand: { push: getCardString( input.cardToGive ) } }
		} )
	] );

	return ctx.prisma.litGame.update( {
		include: { players: true, teams: true, moves: true },
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.GIVEN, turn: takingPlayer } ] } }
	} );
};