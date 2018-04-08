import { Db } from "mongodb";
import UserModel from "../user/user-model";
import { log } from "../../utils";

/**
 * Searches the database for a user with the supplied username or password
 * @param db Database to use
 */
export default async function getUsers(db: Db): Promise<UserModel[]> {
	const foundUsers = await db.collection("users").find<UserModel>({
	
	}, {
		projection: {
			username: 1
		}
	}).toArray();

	return foundUsers;
}
