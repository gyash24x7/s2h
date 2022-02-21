import bcrypt from "bcryptjs";
import type { TrpcResolver } from "@s2h/utils";
import { Constants } from "@s2h/utils";
import { TRPCError } from "@trpc/server";
import type { Account } from "@s2h/prisma";
import { AccountProvider } from "@s2h/prisma";
import type { CreateUserInput, CreateUserResponse } from "@s2h/dtos";

export const createUserResolver: TrpcResolver<CreateUserInput, CreateUserResponse> = async ( { input, ctx } ) => {
	let user = await ctx.prisma.user.findUnique( { where: { email: input.email } } );

	let localAccount: Account | null = null;
	const salt = await bcrypt.genSalt( 10 );
	const hashedPassword = await bcrypt.hash( input.password, salt );

	if ( user ) {
		localAccount = await ctx.prisma.account.findFirst( {
			where: {
				userId: user.id,
				provider: AccountProvider.LOCAL
			}
		} );

		if ( localAccount ) {
			throw new TRPCError( { message: "Account Already Exists!", code: "BAD_REQUEST" } );
		} else {
			await ctx.prisma.account.create( {
				data: {
					provider: AccountProvider.LOCAL,
					password: hashedPassword,
					salt,
					userId: user.id
				}
			} );
		}
	} else {
		user = await ctx.prisma.user.create( {
			data: {
				name: input.name,
				email: input.email,
				profilePic: `${ Constants.AVATAR_BASE_URL }/${ salt }.svg?radius=50`,
				accounts: {
					create: {
						provider: AccountProvider.LOCAL,
						password: hashedPassword,
						salt
					}
				}
			}
		} );
	}

	const emailVerificationHash = await bcrypt.genSalt( 15 );
	await ctx.prisma.verificationToken.create( {
		data: { token: emailVerificationHash, userId: user.id }
	} );

	// TODO: SEND VERIFICATION MAIL

	return { message: "User Created!" };
};