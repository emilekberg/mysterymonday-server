import * as express from "express";
import * as http from "http";
import * as database from "./database";
import * as SocketIO from "socket.io";
import * as path from "path";
import Config from "./interfaces/config";
import credentialsHandler from "./handlers/credentials-handler";
import {log} from "./utils";
import {Db} from "mongodb";

export default function startServer(config: Config, db: Db) {
	const app = express();
	// @ts-ignore TODO: fix this once express is fixed.
	const server = http.createServer(app);
	const io = SocketIO(server);

	app.use(express.static(path.resolve(__dirname, config.http.root)));
	app.get("favicon.ico", (request, response) => {
		response.sendStatus(404);
	});
	app.get("*", (request, response) => {
		response.sendFile(path.resolve(__dirname, config.http.root, "index.html"));
	});


	io.on("connection", (socket) => {
		log(`socket.io user connected`);
		credentialsHandler(db, socket);
	});

	server.listen(config.http.port, () => {
		log(`http listening on *:${config.http.port}`);
	});
}
