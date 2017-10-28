import * as SocketIO from "socket.io";
import {Db} from "mongodb";
import {log} from "./utils";
import { createHash, verifyHash } from "./hash-utils";
import addUser, {AddUserResult} from "./database/procedure/add-user";
import findUser from "./database/procedure/find-user";
import { SignupData } from "./interfaces/signup-data";
import { LoginData } from "./interfaces/login-data";
import { SessionData } from "./interfaces/session-data";
import updateUserSession from "./database/procedure/update-user-session";
export default async function handleConnection(db: Db, socket: SocketIO.Socket) {
	/**
	 * Login the user, if remember is passed store the session.
	 */
	socket.on("login", async (data: LoginData) => {
		const foundUser = await findUser(db, data.username);
		if(!foundUser) {
			socket.emit("login", {
				status: "failed",
				reason: "user not found"
			});
			return;
		}
		const isPasswordCorrect = await verifyHash(data.password, foundUser.authentication.password);
		if(!isPasswordCorrect) {
			socket.emit("login", {
				status: "failed",
				reason: "incorrect password"
			});
			return;
		}
		if(data.remember) {
			const sessionToken = await createHash(`${foundUser._id}-${socket.handshake.address}`);
			updateUserSession(db, data.username, sessionToken);
		}
		socket.emit("login", {
			status: "ok"
		});
	});

	/**
	 * If the user has a stored session, the user can login by sending the token.
	 */
	socket.on("login-session", async (data: SessionData) => {
		const foundUser = await findUser(db, data.username);
		if(!foundUser) {
			socket.emit("login-session", {
				status: "failed",
				reason: "user not found"
			});
			return;
		}
		if(!foundUser.authentication.token) {
			socket.emit("login-session", {
				status: "failed",
				reason: "no stored session found"
			});
			return;
		}
		const hasTokenExpired = false;
		const isTokenCorrect = await verifyHash(data.token, foundUser.authentication.token);
		if(!isTokenCorrect) {
			socket.emit("login-session", {
				status: "failed",
				reason: "incorrect session token"
			});
			return;
		}
		socket.emit("login-session", {
			status: "ok"
		});

	});

	/**
	 * Signup
	 */
	socket.on("signup", async (data: SignupData) => {
		const hashResult = await createHash(data.password);
		const result = await addUser(db, data.username, data.email, hashResult);
		switch(result) {
			default:
			case AddUserResult.InvalidParameters:
				socket.emit("signup", {
					status: "failed",
					reason: "unknown"
				});
				break;
			case AddUserResult.UserExists:
				socket.emit("signup", {
					status: "failed",
					reason: "username or email already used"
				});
				break;
			case AddUserResult.Ok:
				socket.emit("signup", {
					status: "ok"
				});
				break;
		}
	});
}
