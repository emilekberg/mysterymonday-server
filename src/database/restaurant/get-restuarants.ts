import { Db } from "mongodb";
import RestaurantModel from "../restaurant/restaurant-model";

/**
 * Returns the restaurant with the given name.
 * @param db database instance
 * @param restaurantName restaurant name
 */
export default async function getRestaurants(db: Db, withId: boolean = true): Promise<RestaurantModel[]> {
	const fields = !withId ? {_id: 0} : {};
	const collection = db.collection("restaurants");
	const foundRestaurant = await collection.find<RestaurantModel>({}, fields);
	return foundRestaurant.toArray();
}
