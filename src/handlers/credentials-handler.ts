import * as SocketIO from "socket.io";
import {Db, ObjectId} from "mongodb";
import {log} from "../utils";
import { createHash, verifyHash } from "../hash-utils";
import { AddResult } from "../database/procedure/constants";
import addUser from "../database/procedure/user/add-user";
import findUser from "../database/procedure/user/find-user";
import updateUserSession from "../database/procedure/user/update-user-session";
import { SignupData } from "../interfaces/signup-data";
import { LoginData } from "../interfaces/login-data";
import { SessionData } from "../interfaces/session-data";

import handleAuthenticatedConnection from "./authenticated-handler";
export default function credentialsHandler(db: Db, socket: SocketIO.Socket) {
	/**
	 * Login the user, if remember is passed store the session.
	 */
	socket.on("login", async (data: LoginData) => {
		const foundUser = await findUser(db, data.username);
		let token: string|undefined;
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
			const sessionToken = await createHash(`${foundUser._id.toHexString()}-${socket.handshake.address}`);
			token = await updateUserSession(db, data.username, sessionToken);
		}
		socket.emit("login", {
			status: "ok",
			token
		});
		handleAuthenticatedConnection(db, socket, foundUser._id);
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
		// TODO: Store a date for the session and let it expire.
		const hasTokenExpired = false;
		const isTokenCorrect = await verifyHash(`${foundUser._id.toHexString()}-${socket.handshake.address}`, {
			hash: data.token,
			salt: foundUser.authentication.token.salt
		});
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
		handleAuthenticatedConnection(db, socket, foundUser._id);
	});

	/**
	 * Signup
	 */
	socket.on("signup", async (data: SignupData) => {
		const hashResult = await createHash(data.password);
		const result = await addUser(db, data.username, data.email, hashResult);
		switch(result) {
			case AddResult.Exists:
				socket.emit("signup", {
					status: "failed",
					reason: "username or email already used"
				});
				break;
			case AddResult.Ok:
				socket.emit("signup", {
					status: "ok"
				});
				break;
			default:
				socket.emit("signup", {
					status: "failed",
					reason: "unknown"
				});
				break;
		}
	});
}
