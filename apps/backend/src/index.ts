import express from "express";
import morgan from "morgan";
import http from "http";
import ws from "ws";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import deserializeUser from "./middleware/deserialize-user";
import { getLoggedInUser, handleAuthCallback, handleLogout } from "./handlers/auth";
import requireUser from "./middleware/require-user";
import handleTrpc from "./middleware/trpc";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer( app );
const wss = new ws.Server( { server } );

app.use( morgan( "tiny" ) );
app.use( cookieParser() );
app.use( express.json() );
app.use( cors( { credentials: true, origin: "http://localhost:3000" } ) );
app.use( deserializeUser );

app.get( "/api/health", async ( _req, res ) => {
	return res.send( { healthy: true } );
} );

app.get( "/api/me", requireUser, getLoggedInUser );

app.delete( "/api/auth/logout", requireUser, handleLogout );

app.get( "/api/auth/callback/google", handleAuthCallback );

app.use( "/api/trpc", [ requireUser, handleTrpc ] );

wss.on( "connection", ( ws ) => {

	ws.on( "message", ( message: string ) => {
		console.log( "received: %s", message );
		ws.send( JSON.stringify( { message: `Hello, you sent -> ${ message }` } ) );
	} );

	ws.send( JSON.stringify( { message: "Hi there, I am a WebSocket server" } ) );
} );

server.listen( port, () => {
	console.log( `Server started on port ${ port }` );
} );