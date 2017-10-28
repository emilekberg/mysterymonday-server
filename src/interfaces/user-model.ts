import * as MongoDB from "mongodb";
import HashResult from "./hashresult";

export interface UserModel {
	_id?: MongoDB.ObjectId;
	username: string;
	email: string;
	// TODO: check if i need to add current session token here as well.
	authentication: {
		password: HashResult;
		token?: HashResult;
	};
	// TODO: change this once proper implemented.
	groups: string[];
}
