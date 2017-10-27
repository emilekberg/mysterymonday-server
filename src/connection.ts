import * as SocketIO from "socket.io";
import {Db} from "mongodb";
import {log} from "./utils";
import { createHash } from "./hash-utils";
import addUser from "./database/procedure/add-user";
import findUser from "./database/procedure/find-user";
export default async function handleConnection(db: Db, socket: SocketIO.Socket) {
	// setup listeners
	socket.on("login", (data: string) => {
		log(data);
	});

	socket.on("signup", (data: string) => {
		log(data);
	});
}
