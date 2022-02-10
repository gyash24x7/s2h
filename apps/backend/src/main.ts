import express from "express";
import http from "http";
import ws from "ws";
import dotenv from "dotenv";
import { createTrpcMiddleware } from "@s2h/routers/app";
import { PrismaClient } from "@s2h/prisma";
import { handleGoogleAuth } from "@s2h/routers/users";

dotenv.config();

const app = express();
const server = http.createServer( app );
const wss = new ws.Server( { server } );
const prisma = new PrismaClient();

app.use( "/trpc", createTrpcMiddleware( prisma ) );

app.get( "/", ( _req, res ) => {
	res.send( { hello: false } );
} );

app.get( "/oauth/google/redirect", handleGoogleAuth( prisma ) );

wss.on( "connection", ( ws ) => {

	ws.on( "message", ( message: string ) => {
		console.log( "received: %s", message );
		ws.send( `Hello, you sent -> ${ message }` );
	} );

	ws.send( "Hi there, I am a WebSocket server" );
} );

server.listen( process.env.PORT || 8000, () => {
	console.log( `Server started on port ${ process.env.PORT || 8000 }` );
} );