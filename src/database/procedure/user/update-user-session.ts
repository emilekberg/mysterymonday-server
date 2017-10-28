import { Db } from "mongodb";
import HashResult from "../../../interfaces/hashresult";

export default async function updateUserSession(db: Db, username: string, token: HashResult) {
	const collection = db.collection("users");
	try {
		const result = await collection.updateOne({
			username: {
				$eq: username
			}
		}, {
			$set: {
				"authentication.token": token
			}
		});
	}
	catch {
		return undefined;
	}
	return token.hash;
}
