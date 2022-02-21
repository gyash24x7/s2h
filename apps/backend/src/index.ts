import express from "express";
import http from "http";
import ws from "ws";
import { PrismaClient } from "@s2h/prisma";
import { createTrpcMiddleware } from "@s2h/routers";
import { handleGoogleAuth } from "@s2h/routers/users";

const port = process.env[ "PORT" ] || 8000;

const app = express();
const server = http.createServer( app );
const wss = new ws.Server( { server } );
const prisma = new PrismaClient( { log: [ "query" ] } );

app.use( "/trpc", createTrpcMiddleware( prisma ) );

app.get( "/", async ( _req, res ) => {
	await prisma.account.findMany();
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

server.listen( port, () => {
	console.log( `Server started on port ${ port }` );
} );