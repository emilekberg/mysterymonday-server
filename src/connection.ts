import * as SocketIO from "socket.io";
import {Db} from "mongodb";
import {log} from "./utils";
export default function handleConnection(db: Db, socket: SocketIO.Socket) {
	// setup listeners
	socket.on("login", (data: string) => {
		log(data);
	});
}
