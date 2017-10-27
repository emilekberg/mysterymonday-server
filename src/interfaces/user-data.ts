import HashResult from "./hashresult";

export interface UserData {
	username: string;
	email: string;
	// TODO: check if i need to add current session token here as well.
	authentication: HashResult;
	// TODO: change this once proper implemented.
	groups: string[];
}
