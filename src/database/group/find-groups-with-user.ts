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
		users: {
			$elemMatch: {
				$eq: userid
			}
		},
		
	}, {
		projection: {
			_id: 0,
			users: 0,
			restaurants: 0
		}
	}).toArray());
	return groups;
}
