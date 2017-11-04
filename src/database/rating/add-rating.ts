import { Db, ObjectId } from "mongodb";
import { Ratings } from "../rating/rating-model";
import { AddResult } from "../constants";
export default async function addRating(db: Db, restaurantId: ObjectId, userId: ObjectId, groupId: ObjectId, orderedFood: string, comment: string, rating: Ratings) {
	const collection = db.collection("ratings");
	const existingRating = await collection.findOne({
		$and: [
			{restaurantId: {$eq: restaurantId}},
			{userId: {$eq: userId}},
			{groupId: {$eq: groupId}}
		]
	});
	if(existingRating) {
		return AddResult.Exists;
	}
	const data = {
		restaurantId,
		userId,
		groupId,
		orderedFood,
		comment,
		rating
	};
	const result = await collection.insertOne(data);
	return AddResult.Ok;
}
