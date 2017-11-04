import { Db } from "mongodb";
import RestaurantModel from "../restaurant/restaurant-model";

/**
 * Returns the restaurant with the given name.
 * @param db database instance
 * @param restaurantName restaurant name
 */
export default async function findRestaurant(db: Db, restaurantName: string): Promise<RestaurantModel|null> {
	const collection = db.collection("restaurants");
	const foundRestaurant = await collection.findOne<RestaurantModel>({
		name: {
			$eq: restaurantName
		}
	});
	return foundRestaurant;
}
