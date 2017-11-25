import { Db, ObjectId } from "mongodb";
import GroupModel from "../group/group-model";

/**
 * Searches the database for a user with the supplied username or password
 * @param db Database to use
 * @param username Username to search for
 * @param email Email to search for
 */
export default async function findGroupsWithUser(db: Db, userid: ObjectId): Promise<GroupModel[]> {
	const groups = (await db.collection("groups").find<GroupModel>({
		members: {
			$elemMatch: {
				$eq: userid
			}
		}
	}, {
		_id: 0,
		members: 0
	}).toArray());
	return groups;
}
