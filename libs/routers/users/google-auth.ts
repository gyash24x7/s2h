import type { ExpressResolver } from "@s2h/utils";
import { AccountProvider } from "@s2h/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const handleGoogleAuth: ExpressResolver = ( prisma ) => async ( _req, res ) => {
	const email = "";
	const name = "";
	const profilePic = "";

	let user = await prisma.user.findUnique( { where: { email } } );
	const salt = await bcrypt.genSalt( 10 );

	if ( user ) {
		const googleAccount = await prisma.account.findFirst( {
			where: {
				userId: user.id,
				provider: AccountProvider.GOOGLE
			}
		} );

		if ( !googleAccount ) {
			await prisma.account.create( {
				data: {
					provider: AccountProvider.GOOGLE,
					userId: user.id,
					salt
				}
			} );
		}
	} else {
		user = await prisma.user.create( {
			data: {
				name,
				email,
				profilePic,
				accounts: {
					create: {
						provider: AccountProvider.GOOGLE,
						salt
					}
				}
			}
		} );
	}

	const token = jwt.sign( { id: user.id, avatar: user.profilePic }, process.env[ "SECRET" ]!, { subject: user.id } );
	res.redirect( `http://localhost:3000/token=${ token }` );
};