import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { AccountProvider } from "@s2h/prisma";
import jwt from "jsonwebtoken";
import type { TrpcResolver } from "@s2h/utils";
import type { LoginInput, LoginResponse } from "@s2h/dtos";

export const loginResolver: TrpcResolver<LoginInput, LoginResponse> = async function ( { input, ctx } ) {
	const user = await ctx.prisma.user.findUnique( { where: { email: input.email } } );
	if ( !user ) {
		throw new TRPCError( { message: "User Not Found!", code: "NOT_FOUND" } );
	}

	const localAccount = await ctx.prisma.account.findFirst( {
		where: {
			userId: user.id,
			provider: AccountProvider.LOCAL
		}
	} );

	if ( !localAccount ) {
		throw new TRPCError( { message: "Account Not Found!", code: "NOT_FOUND" } );
	}

	const doPasswordsMatch = bcrypt.hashSync( input.password, localAccount.salt ) === localAccount.password;
	if ( !doPasswordsMatch ) {
		throw new TRPCError( { message: "Invalid Credentials!", code: "BAD_REQUEST" } );
	}

	const token = jwt.sign(
		{ id: user.id, avatar: user.profilePic },
		process.env[ "JWT_SECRET" ]!,
		{ subject: user.id }
	);
	return { token };
};