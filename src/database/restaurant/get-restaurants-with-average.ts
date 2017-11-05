import {Db, ObjectId } from "mongodb";
import RestaurantSumModel from "./resturant-sum-model";
export default async function getRestaurantsWithAverage(db: Db, restaurantId?: ObjectId) {
	const collection = db.collection("restaurants");
	const result = await (collection.aggregate<RestaurantSumModel>([
		{
			$lookup: {
				from: "ratings",
				localField: "_id",
				foreignField: "restaurantId",
				as: "ratings"
			}
		},
		{
			$addFields: {
				average: {
					$reduce: {
						input: "$ratings",
						initialValue: null,
						in: {
							$divide: [
								{
									$add: [
										"$$this.rating.taste.score",
										"$$this.rating.service.score",
										"$$this.rating.cozyness.score",
										"$$this.rating.cost.score"
									]
								}, 4
							]
						}
					}
				}
			}
		},
		{
			$project: {
				ratings: 0,
				_id: 0
			}
		}
	]).toArray());
	return result;
}
