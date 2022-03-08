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
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { literatureRouter as router, LiteratureRouter } from "@s2h/routers";
import ee from "./utils/events";
import prisma from "./utils/prisma";

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

applyWSSHandler<LiteratureRouter>( {
	wss,
	router,
	createContext: () => (
		{ prisma, ee }
	)
} );

server.listen( port, () => {
	console.log( `Server started on port ${ port }` );
} );