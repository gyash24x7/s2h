import { z } from "zod";
import bcrypt from "bcryptjs";
import {
	AVATAR_BASE_URL,
	EMAIL_VERIFICATION_SUBJECT,
	passwordRegex,
	VERIFICATION_BASE_URL
} from "@s2h/utils/constants";
import { sendMail } from "@s2h/utils/sendgrid";
import type { TrpcResolver } from "@s2h/utils/trpc";
import { TRPCError } from "@trpc/server";
import { Account, AccountProvider } from "@s2h/prisma";

export const createUserInput = z.object( {
	name: z.string().nonempty(),
	email: z.string().nonempty().email(),
	password: z.string().nonempty().min( 8 ).regex( passwordRegex )
} );

export type CreateUserInput = z.infer<typeof createUserInput>

export type CreateUserResponse = {
	message?: "User Created!"
}

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
				profilePic: `${ AVATAR_BASE_URL }/${ salt }.svg?radius=50`,
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

	await sendMail( {
		to: user.email,
		subject: EMAIL_VERIFICATION_SUBJECT,
		text: `${ VERIFICATION_BASE_URL }?token=${ emailVerificationHash }`
	} );

	return { message: "User Created!" };
};