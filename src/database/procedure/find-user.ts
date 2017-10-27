import { Db } from "mongodb";

export default async function findUser(db: Db, username?: string, email?: string) {
	if(!db) {
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
	const collection = db.collection("users");
	const foundUser = await collection.findOne({
		$and
	});
	return foundUser;
}
