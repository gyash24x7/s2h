import type { LitGameData, TrpcResolver } from "@s2h/utils";
import { Subscription } from "@trpc/server";
import type { GetGameInput } from "@s2h/dtos";

export const gameUpdateResolver: TrpcResolver<GetGameInput, Subscription<LitGameData>> = function ( { input, ctx } ) {
	return new Subscription<LitGameData>( emit => {
		const onLitGameUpdate = ( data: LitGameData ) => {
			emit.data( data );
		};

		ctx.ee.on( input.gameId, onLitGameUpdate );
		return () => ctx.ee.off( input.gameId, onLitGameUpdate );
	} );
};