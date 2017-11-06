import {Db, ObjectId } from "mongodb";
import RestaurantSumModel from "./resturant-sum-model";
export default async function getRestaurantsWithAverage(db: Db, restaurantId: ObjectId) {
	const collection = db.collection("restaurants");
	const result = await (collection.aggregate<RestaurantSumModel>([
		{
			$match: {
				_id: restaurantId
			}
		},
		{
			$lookup: {
				from: "ratings",
				localField: "_id",
				foreignField: "restaurantId",
				as: "ratings"
			}
		},
		{
			$project: {
				ratings: {
					$filter: {
						input: "$ratings",
						cond: {
							$eq: ["$$this.restaurantId", restaurantId]
						}
					}
				}
			}
		}
	]).toArray());
	return result;
}
