import { Db, ObjectId } from "mongodb";
import { UpdateResult } from "../constants";
import GroupModel from "../group/group-model";
import UserModel from "../user/user-model";

/**
 * Adds a number of users to a group. Resolves usernames to userids before adding them.
 * @param db database instance
 * @param groupName to which group to add
 * @param userId User that adds the other users
 * @param userNamesToAdd the usernames to add
 */
export default async function addUsersToGroup(db: Db, groupName: string, userId: ObjectId, userNamesToAdd: string[]): Promise<number> {
	const userIdsToAdd = (await db.collection("users").find<UserModel>({
		username: {
			$in: userNamesToAdd
		}
	}, {
		projection: {
			_id: 1
		}
	}).toArray()).map(user => user._id);

	const result = await db.collection("groups").updateOne({
		name: {
			$eq: groupName
		},
		members: {
			$elemMatch: {
				$eq: userId
			}
		}
	}, {
		$addToSet: {
			members: {
				$each: userIdsToAdd
			}
		}
	});
	return UpdateResult.Ok;
}
