import axios from "axios";
import type { GoogleTokenResult, GoogleUserResult } from "@s2h/utils";
import { GOOGLE_GET_USER_URL, GOOGLE_TOKEN_URL } from "@s2h/utils";

export async function getGoogleToken( code: string ) {
	const url = new URL( GOOGLE_TOKEN_URL );
	url.searchParams.append( "code", code );
	url.searchParams.append( "client_id", process.env.GOOGLE_CLIENT_ID! );
	url.searchParams.append( "client_secret", process.env.GOOGLE_CLIENT_SECRET! );
	url.searchParams.append( "code", code );
	url.searchParams.append( "code", code );

	const res = await axios.post<GoogleTokenResult>( url.toString(), {
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	} );

	return res.data;
}


export async function getGoogleUser( access_token: string, id_token: string ) {
	const url = new URL( GOOGLE_GET_USER_URL );
	url.searchParams.append( "alt", "json" );
	url.searchParams.append( "access_token", access_token );

	const res = await axios.get<GoogleUserResult>( url.toString(), {
		headers: { Authorization: `Bearer ${ id_token }` }
	} );
	return res.data;
}