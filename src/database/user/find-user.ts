import { Db } from "mongodb";
import UserModel from "../user/user-model";
import { log } from "../../utils";

/**
 * Searches the database for a user with the supplied username or password
 * @param db Database to use
 * @param username Username to search for
 * @param email Email to search for
 */
export default async function findUser(db: Db, username?: string, email?: string): Promise<UserModel|null> {
	if(!username && !email) {
		log("findUser: both values are null");
		return null;
	}
	const $and: Array<{}> = [];
	if(username) {
		$and.push({
			username:{
				$eq: username
			}
		});
	}
	if(email) {
		$and.push({
			email:{
				$eq: email
			}
		});
	}
	const foundUser = await db.collection("users").findOne<UserModel>({
		$and
	});
	return foundUser;
}
