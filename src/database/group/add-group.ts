import { Db } from "mongodb";
import { AddResult } from "../constants";
import UserModel from "../user/user-model";

export default async function addGroup(db: Db, groupName: string, usernamesToAdd?: string[]): Promise<number> {
	const collection = db.collection("groups");
	const existingGroup = await collection.findOne({
		name: {
			$eq: groupName
		}
	});
	if(existingGroup) {
		return AddResult.Exists;
	}
	const members = usernamesToAdd ? await (await db.collection("users").find<UserModel>({
		username: {
			$in: usernamesToAdd
		},
	}, { 
		projection: {
			_id: 1
		}
	}).toArray()).map((user) => user._id) : [];
	const data = {
		name: groupName,
		members
	};
	const result = await collection.insertOne(data);
	return AddResult.Ok;
}
