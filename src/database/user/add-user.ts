import { Db } from "mongodb";
import { SignupData } from "../../interfaces/signup-data";
import UserModel from "../user/user-model";
import HashResult from "../../interfaces/hashresult";
import { AddResult } from "../constants";

/**
 * Used when adding a new user to the database
 * @param db the db instance to use.
 * @param username the username of the user.
 * @param email the email of the user.
 * @param hashResult the hashed result of the password specified.
 */
export default async function addUser(db: Db, username: string, email: string, hashResult: HashResult): Promise<number> {
	const collection = db.collection("users");
	const existingUser = await collection.findOne({
		$or: [
			{username:{$eq: username }},
			{email:{ $eq: email }}
		]
	});
	if(existingUser) {
		return AddResult.Exists;
	}
	const data = {
		username,
		authentication: {
			password: hashResult,
			token: {
				hash: "",
				salt: ""
			}
		},
		email
	};
	const result = await collection.insertOne(data);
	return AddResult.Ok;
}
