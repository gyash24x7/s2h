import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import type { NextApiHandler } from "next";

const authHandler: NextApiHandler = NextAuth( {
	pages: {
		signIn: "/login"
	},
	secret: process.env[ "SECRET" ],
	providers: [
		Auth0Provider( {
			clientId: process.env[ "AUTH0_CLIENT_ID" ]!,
			clientSecret: process.env[ "AUTH0_CLIENT_SECRET" ]!,
			issuer: process.env[ "AUTH0_ISSUER" ]
		} )
	]
} );

export default authHandler;