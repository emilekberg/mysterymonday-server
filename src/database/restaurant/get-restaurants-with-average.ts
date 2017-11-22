import {Db, ObjectId } from "mongodb";
import RestaurantSumModel from "./resturant-sum-model";
export default async function getRestaurantsWithAverage(db: Db, restaurantIds?: ObjectId[]) {
	const pipeline = [];
	if(restaurantIds) {
		pipeline.push({
			$match: {
				_id: {
					$in: restaurantIds
				}
			}
		});
	}
	pipeline.push(...[
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
							$avg: [
								"$$this.rating.taste.score",
								"$$this.rating.service.score",
								"$$this.rating.cozyness.score",
								"$$this.rating.cost.score",
								"$$value"
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
	]);
	const result = await (db.collection("restaurants").aggregate<RestaurantSumModel>(pipeline).toArray());
	return result;
}
