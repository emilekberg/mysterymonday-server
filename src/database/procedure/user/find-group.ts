import { Db } from "mongodb";
import UserModel from "../../models/user-model";

/**
 * Searches the database for a user with the supplied username or password
 * @param db Database to use
 * @param username Username to search for
 * @param email Email to search for
 */
export default async function findGroup(db: Db, groupName: string): Promise<UserModel|null> {
	const collection = db.collection("groups");
	const foundUser = await collection.findOne({
		name: {
			$eq: groupName
		}
	});
	return foundUser;
}
