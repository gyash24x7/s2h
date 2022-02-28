import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextApiHandler } from "next";

const authHandler: NextApiHandler = NextAuth( {
	secret: process.env[ "SECRET" ],
	providers: [
		GoogleProvider( {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: { params: { scope: "openid email profile" } }
		} )
	]
} );

export default authHandler;