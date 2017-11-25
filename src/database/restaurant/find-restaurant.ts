import { Db } from "mongodb";
import RestaurantModel from "../restaurant/restaurant-model";

/**
 * Returns the restaurant with the given name.
 * @param db database instance
 * @param restaurantName restaurant name
 */
const cache = new Map<string, RestaurantModel>();
export default async function findRestaurant(db: Db, restaurantName: string): Promise<RestaurantModel|null> {
	if(cache.has(restaurantName)) {
		// @ts-ignore TODO: remove once typescript has fixed this.
		return cache.get(restaurantName);
	}
	const collection = db.collection("restaurants");
	const foundRestaurant = await collection.findOne<RestaurantModel>({
		name: {
			$eq: restaurantName
		}
	});
	if(foundRestaurant)
	{
		cache.set(restaurantName, foundRestaurant);
	}
	return foundRestaurant;
}
