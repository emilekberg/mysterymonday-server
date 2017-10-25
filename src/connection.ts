import * as SocketIO from "socket.io";
import {log} from "./utils";
export default function handleConnection(socket: SocketIO.Socket) {
	// setup listeners
	socket.on("login", (data: string) => {
		log(data);
	});
}
