import { z } from "zod";
import { TrpcResolver } from "@s2h/utils/trpc";
import { TRPCError } from "@trpc/server";

export const verifyUserInput = z.object( {
	token: z.string().nonempty()
} );

export type VerifyUserInput = z.infer<typeof verifyUserInput>;

export type VerifyUserResponse = { error: string } | { message: string };

export const verifyUserResolver: TrpcResolver<VerifyUserInput, VerifyUserResponse> = async ( { input, ctx } ) => {
	const token = await ctx.prisma.verificationToken.findUnique( { where: { token: input.token } } );
	if ( !token ) {
		throw new TRPCError( { message: "Cannot verify User!", code: "BAD_REQUEST" } );
	}

	const user = await ctx.prisma.user.findUnique( { where: { id: token.userId } } );
	if ( !user ) {
		throw new TRPCError( { message: "User Not Found!", code: "NOT_FOUND" } );
	}

	await ctx.prisma.user.update( { where: { id: token.userId }, data: { verified: true } } );
	await ctx.prisma.verificationToken.delete( { where: { token: input.token } } );
	return { message: "User verified!" };
};