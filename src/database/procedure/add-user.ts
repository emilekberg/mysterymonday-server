import { Db } from "mongodb";
import { SignupData } from "../../interfaces/signup-data";
import { UserData } from "../../interfaces/user-data";
import HashResult from "../../interfaces/hashresult";

/**
 * User when adding a new user to the database
 * @param db the db instance to use.
 * @param username the username of the user.
 * @param email the email of the user.
 * @param hashResult the hashed result of the password specified.
 */
export default async function addUser(db: Db, username: string, email: string, hashResult: HashResult) {
	if(!db) {
		return null;
	}
	const collection = db.collection("users");
	const existingUser = await collection.findOne({
		$or: [
			{username:{$eq: username }},
			{email:{ $eq: email }}
		]
	});
	if(existingUser) {
		return null;
	}
	const data: UserData = {
		username,
		authentication: hashResult,
		email,
		groups: []
	};
	const result = await collection.insertOne(data);
	return result;
}
