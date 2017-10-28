import { Db } from "mongodb";
import { AddResult } from "../constants";
/**
 * Adds a new restaurant to the database
 * @param db
 * @param restaurantName
 */
export default async function addRestaurant(db: Db, restaurantName: string) {
	const collection = db.collection("restaurants");
	const existingRestaurant = await collection.findOne({
		restaurantName: {
			$eq: restaurantName
		}
	});
	if(existingRestaurant) {
		return AddResult.Exists;
	}
	const data = {
		restaurantName
	};
	const result = await collection.insertOne(data);
	return AddResult.Ok;
}
