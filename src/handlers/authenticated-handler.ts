import { Db, ObjectId } from "mongodb";
import getRestaurants from "../database/procedure/restaurant/get-restuarants";
import RestaurantData from "../interfaces/restaurant-data";
import GroupData from "../interfaces/group-data";
import addRestaurant from "../database/procedure/restaurant/add-restaurant";
import { AddResult, UpdateResult } from "../database/procedure/constants";
import findUser from "../database/procedure/user/find-user";
import addUsersToGroup from "../database/procedure/user/add-users-to-group";
import addGroup from "../database/procedure/user/add-group";
import UserModel from "../database/models/user-model";
import RatingData from "../interfaces/rating-data";
import addRating from "../database/procedure/rating/add-rating";
import findRestaurant from "../database/procedure/restaurant/find-restaurant";
import findGroup from "../database/procedure/user/find-group";

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
		if(!restaurant) {
			return;
		}
		if(!user) {
			return;
		}
		if(!group) {
			return;
		}

		await addRating(db, restaurant._id, user._id, group._id, data.orderedFood, data.comment, data.ratings);
	}

	onAddRating({
		username: "emil",
		group: "MysteryMonday",
		restaurant: "jallajalla",
		comment: "sådär gott alltså",
		orderedFood: "falafel tror jag",
		ratings: {
			cost: {score: 5, comment: "rätt billigt"},
			cozyness:{score: 1, comment: "lite tråkig inredning"},
			service: {score: 3, comment: "helt ok"},
			taste: {score: 1, comment: "inget jag rekommenderar"},
		}
	});
}
