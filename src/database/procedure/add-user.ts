import { Db } from "mongodb";
import { SignupData } from "../../interfaces/signup-data";
import { UserModel } from "../../interfaces/user-model";
import HashResult from "../../interfaces/hashresult";

/**
 * Used when adding a new user to the database
 * @param db the db instance to use.
 * @param username the username of the user.
 * @param email the email of the user.
 * @param hashResult the hashed result of the password specified.
 */
export enum AddUserResult {
	Ok,
	UserExists,
	InvalidParameters
}
export default async function addUser(db: Db, username: string, email: string, hashResult: HashResult): Promise<number> {
	const collection = db.collection("users");
	const existingUser = await collection.findOne({
		$or: [
			{username:{$eq: username }},
			{email:{ $eq: email }}
		]
	});
	if(existingUser) {
		return AddUserResult.UserExists;
	}
	const data: UserModel = {
		username,
		authentication: {
			password: hashResult
		},
		email,
		groups: []
	};
	const result = await collection.insertOne(data);
	return AddUserResult.Ok;
}
