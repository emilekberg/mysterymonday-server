import {Db, ObjectId } from "mongodb";
import RatingModel from "./rating-model";
export default async function findRatings(db: Db, restaurantId?: ObjectId, userId?: ObjectId, groupId?: ObjectId, withId: boolean = true) {
	const fields = !withId ? {_id: 0} : {};
	const $and: Array<{}> = [];
	if(restaurantId) {
		$and.push({
			restaurantId: {
				$eq: restaurantId
			}
		});
	}
	if(userId) {
		$and.push({
			userId: {
				$eq: userId
			}
		});
	}
	if(groupId) {
		$and.push({
			groupId: {
				$eq: groupId
			}
		});
	}

	const collection = db.collection("ratings");
	const filter = $and.length > 0 ? {$and} : {};
	const foundRating = await (collection.find<RatingModel>(filter, fields).toArray());
	return foundRating;
}
