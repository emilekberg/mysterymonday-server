import * as express from "express";
import * as http from "http";
import * as database from "./database";
import * as SocketIO from "socket.io";
import * as path from "path";
import ConfigInterface from "./interfaces/config";
import {log, getFileAsJson, getFile} from "./utils";
import credentialsHandler from "./handlers/credentials-handler";
import {setPepper} from "./hash-utils";
const config = getFileAsJson<ConfigInterface>("config.json");
if (!config) {
	log("config.json does not exist. Create one following the config interface");
	process.exit(1);
}

const app = express();
const server = new http.Server(app);
const io = SocketIO(server);

if(config.pepper) {
	setPepper(config.pepper);
}

database.open(config.mongodb.uri).then((db) => {
	// database has opened
	try {
		app.use(express.static(path.resolve(__dirname, config.http.root)));
		app.get("/", (request, response) => {
			response.sendFile(path.resolve(__dirname, config.http.root, "index.html"));
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
	catch(e) {
		log(e);
		database.close();
	}
}).catch((e) => {
	log(e);
});
