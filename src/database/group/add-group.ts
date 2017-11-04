import { Db } from "mongodb";
import { AddResult } from "../constants";
import UserModel from "../user/user-model";

export default async function addGroup(db: Db, groupName: string, userIdsToAdd?: string[]): Promise<number> {
	const collection = db.collection("groups");
	const existingGroup = await collection.findOne({
		name: {
			$eq: groupName
		}
	});
	if(existingGroup) {
		return AddResult.Exists;
	}
	const members = userIdsToAdd ? await (await db.collection("users").find<UserModel>({
		username: {
			$in: userIdsToAdd
		}
	}, {
		_id: 1
	}).toArray()).map((user) => user._id) : [];
	const data = {
		name: groupName,
		members
	};
	const result = await collection.insertOne(data);
	return AddResult.Ok;
}
