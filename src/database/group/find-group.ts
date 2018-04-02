import { Db } from "mongodb";
import GroupModel from "../group/group-model";
import { ObjectId } from "bson";
import { log } from "../../utils";

/**
 * Searches the database for group with outher name or id
 * @param db Database to use
 * @param username Username to search for
 * @param email Email to search for
 */
export default async function findGroup(db: Db, groupName?: string, groupId?: ObjectId): Promise<GroupModel|null> {
	if(!groupName && !groupId) {
		log("findGroup: both values are null");
		return null;
	}
	const $or: Array<{}> = [];
	if(groupName) {
		$or.push({
			name: {$eq: groupName}
		});
	}
	else if(groupId) {
		$or.push({
			_id: {$eq: groupId}
		});
	}
	const foundGroup = await db.collection("groups").findOne<GroupModel>({$or});
	return foundGroup;
}
