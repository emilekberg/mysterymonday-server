import {Db, ObjectId } from "mongodb";
import RestaurantSumModel from "./resturant-sum-model";
export default async function getRatingSumForRestaurant(db: Db, restaurantId?: ObjectId) {
	const collection = db.collection("ratings");
	const result = await (collection.aggregate<RestaurantSumModel>([
		{
			$group: {
				_id: restaurantId ? restaurantId: "$_id",
				average: {
					$sum: {
						$divide: [
							{
								$add: [
									"$rating.taste.score",
									"$rating.service.score",
									"$rating.cozyness.score",
									"$rating.cost.score"
								]
							}, 4
						]
					}
				}
			}
		},
		{
			$lookup: {
				from: "restaurants",
				localField: "_id",
				foreignField: "_id",
				as: "name"
			}
		},
		{
			$addFields: {
				name: {
					$reduce: {
						input: "$name",
						initialValue: "",
						in: "$$this.name"
					}
				}
			}
		}
	]).toArray());
	return result;
}
