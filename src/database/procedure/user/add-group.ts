import { Db } from "mongodb";
import { AddResult } from "../constants";

export default async function addGroup(db: Db, groupName: string): Promise<number> {
	const collection = db.collection("groups");
	const existingGroup = await collection.findOne({
		name: {
			$eq: groupName
		}
	});
	if(existingGroup) {
		return AddResult.Exists;
	}
	const data = {
		name: groupName,
		members: []
	};
	const result = await collection.insertOne(data);
	return AddResult.Ok;
}
