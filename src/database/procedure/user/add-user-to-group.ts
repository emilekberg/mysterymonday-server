import { Db, ObjectId } from "mongodb";
import { UpdateResult } from "../constants";
import GroupModel from "../../models/group-model";

export default async function addUserToGroup(db: Db, groupName: string, userId: ObjectId): Promise<number> {
	const collection = db.collection("groups");
	/*
	const existingGroup = await collection.findOne<GroupModel>({
		name: {
			$eq: groupName
		}
	});
	if(!existingGroup) {
		return UpdateResult.NotFound;
	}
	if(existingGroup.members.includes(userId)) {
		return UpdateResult.NoUpdatePerformed;
	}
	*/
	const result = await collection.updateOne({
		name: {
			$eq: groupName
		},
		members: {
			$elemMatch: {
				$eq: userId
			}
		}
	}, {
		members: {
			$push: userId
		}
	});
	return UpdateResult.Ok;
}
