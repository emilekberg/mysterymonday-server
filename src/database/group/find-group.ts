import { Db } from "mongodb";
import GroupModel from "../group/group-model";

/**
 * Searches the database for a user with the supplied username or password
 * @param db Database to use
 * @param username Username to search for
 * @param email Email to search for
 */
export default async function findGroup(db: Db, groupName: string): Promise<GroupModel|null> {
	console.time("findGroup");
	const foundGroup = await db.collection("groups").findOne<GroupModel>({
		name: {
			$eq: groupName
		}
	});
	console.timeEnd("findGroup");
	return foundGroup;
}
