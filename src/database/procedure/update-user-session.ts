import { Db } from "mongodb";
import HashResult from "../../interfaces/hashresult";

export default async function updateUserSession(db: Db, username: string, token: HashResult) {
	if(!db) {
		return;
	}
}
