import { Db, ObjectId } from "mongodb";
import getRestaurants from "../database/restaurant/get-restuarants";
import RestaurantData from "../interfaces/restaurant-data";
import GroupData from "../interfaces/group-data";
import addRestaurant from "../database/restaurant/add-restaurant";
import { AddResult, UpdateResult } from "../database/constants";
import findUser from "../database/user/find-user";
import addUsersToGroup from "../database/group/add-users-to-group";
import UserModel from "../database/user/user-model";
import RatingData from "../interfaces/rating-data";
import addRating from "../database/rating/add-rating";
import findRestaurant from "../database/restaurant/find-restaurant";
import addGroup from "../database/group/add-group";
import findGroup from "../database/group/find-group";
import findRatings from "../database/rating/find-ratings";
import getRatingSumForRestaurant from "../database/restaurant/get-sum-for-restaurant";
import { log } from "../utils";

/**
 * Adds a number of listeners on the socket that handles authenticated connections.
 * @param db db instance
 * @param socket socket instance
 * @param user the authenticated user
 */
export default function handleAuthenticatedConnection(db: Db, socket: SocketIO.Socket, user: UserModel) {

	socket.on("add-restaurant", onAddRestaurant);
	socket.on("get-restaurants", onGetRestaurants);
	socket.on("add-group", onAddGroup);
	socket.on("add-to-group", onAddToGroup);
	socket.on("add-rating", onAddRating);
	socket.on("find-ratings", onFindRatings);
	socket.on("get-average-for-restaurant", onGetAverageRatingsForRestaurants);

	/**
	 * Adds a new restaurant to the database
	 * @param data
	 */
	async function onAddRestaurant(data: RestaurantData) {
		const result = await addRestaurant(db, data.name);
		switch(result) {
			case AddResult.Exists:
				socket.emit("add-restaurant", {
					status: "failed",
					reason: "already existing"
				});
				break;
			case AddResult.Ok:
				socket.emit("add-restaurant", {
					status: "ok"
				});
				break;
		}
	}

	/**
	 * Returns all restaurants
	 */
	async function onGetRestaurants() {
		const result = await getRestaurants(db, false);
		socket.emit("restaurants", result);
	}

	/**
	 * Adds a new group. Each user needs to be part of a group to review.
	 */
	async function onAddGroup(data: GroupData) {
		if(!data.usersToAdd.includes(user.username)) {
			data.usersToAdd.push(user.username);
		}
		const result = await addGroup(db, data.groupName, data.usersToAdd);
		if(result !== AddResult.Ok) {
			socket.emit("add-group", {
				status: "failed"
			});
			return;
		}
		socket.emit("add-group", {
			status: "ok"
		});
	}

	/**
	 * Add users to a group. Needs to be an array of users.
	 */
	async function onAddToGroup(data: GroupData) {
		const result = await addUsersToGroup(db, data.groupName, user._id, data.usersToAdd);
		if(result !== UpdateResult.Ok) {
			socket.emit("added-to-group", {
				status: "failed"
			});
			return;
		}
		socket.emit("added-to-group", {
			status: "ok"
		});
	}

	/**
	 * Adds a rating to the system
	 */
	async function onAddRating(data: RatingData) {
		const [restaurant, user, group] = await Promise.all([
			findRestaurant(db, data.restaurant),
			findUser(db, data.username),
			findGroup(db, data.group)
		]);
		if(!restaurant || !user || !group) {
			return;
		}
		const result = await addRating(db, restaurant._id, user._id, group._id, data.orderedFood, data.comment, data.ratings);
	}

	async function onFindRatings(data: any) {
		const [restaurant, user, group] = await Promise.all([
			findRestaurant(db, data.restaurant),
			findUser(db, data.username),
			findGroup(db, data.group)
		]);
		const restaurantId = restaurant ? restaurant._id : undefined;
		const userId = user ? user._id : undefined;
		const groupId = group ? group._id : undefined;
		const ratings = await findRatings(db, restaurantId, userId, groupId, false);
		socket.emit("ratings", {
			status: "ok",
			ratings
		});
	}

	async function onGetAverageRatingsForRestaurants() {
		const restaurant = await findRestaurant(db, "jallajalla");
		if(!restaurant) {
			return;
		}
		const result = await getRatingSumForRestaurant(db, restaurant._id);
		log(JSON.stringify(result));
	}

	onGetAverageRatingsForRestaurants();
}
