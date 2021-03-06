import {Db, ObjectId } from "mongodb";
import RatingModel from "./rating-model";
import { log } from "../../utils";
export default async function findRatings(db: Db, restaurantId?: ObjectId, userId?: ObjectId, groupId?: ObjectId, withId: boolean = true) {
	const projection = !withId ? {
		_id: 0,
		restaurantId: 0,
		userId: 0,
		groupId: 0
	} : {};
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

	const query = $and.length > 0 ? {$and} : {};
	try {
		const foundRating = await (db.collection("ratings").find<RatingModel>(query, {projection}).toArray());
		return foundRating;
	}
	catch(e) {
		log(e);
		return null;
	}
}
