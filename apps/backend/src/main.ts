import express from "express";
import { PrismaClient } from "@s2h/prisma";

const app = express();
const prisma = new PrismaClient( { log: [ "query" ] } );

app.get( "/api", async ( req, res ) => {
	await prisma.user.findMany();
	res.send( { message: "Welcome to backend!" } );
} );

const port = process.env.port || 3333;
const server = app.listen( port, () => {
	console.log( `Listening at http://localhost:${ port }/api` );
} );
server.on( "error", console.error );
