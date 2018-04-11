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
import { log } from "../utils";
import getRestaurantsWithAverage from "../database/restaurant/get-restaurants-with-average";
import findGroupsWithUser from "../database/group/find-groups-with-user";
import * as SocketIO from "socket.io"
import getUsers from "../database/user/get-users";
/**
 * Adds a number of listeners on the socket that handles authenticated connections.
 * @param db db instance
 * @param socket socket instance
 * @param user the authenticated user
 */
export default async function handleAuthenticatedConnection(db: Db, socket: SocketIO.Socket, currentUser: UserModel) {
	socket.on("select-group", onSelectGroup);
	socket.on("add-restaurant", onAddRestaurant);
	socket.on("get-restaurants", onGetRestaurants);
	socket.on("add-group", onAddGroup);
	socket.on("add-to-group", onAddToGroup);
	socket.on("get-user-groups", onGetUserGroups);
	socket.on("add-rating", onAddRating);
	socket.on("find-ratings", onFindRatings);
	socket.on("get-restaurants-score", onGetRestaurantScore);
	socket.on("get-users", onGetUsernames);
	let selectedGroupId: ObjectId|undefined;
	async function onSelectGroup(data: GroupData) {
		const result = await findGroup(db, data.groupName);
		if(!result) {
			socket.emit("selected-group", {
				status: "failed"
			});
			return;
		}
		socket.emit("selected-group", {
			status: "ok"
		});
		selectedGroupId = result._id;
	}

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
		if(!data.usersToAdd.includes(currentUser.username)) {
			data.usersToAdd.push(currentUser.username);
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
		const result = await addUsersToGroup(db, data.groupName, currentUser._id, data.usersToAdd);
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

	async function onGetUserGroups() {
		const result = (await findGroupsWithUser(db, currentUser._id)).map(group => group.name);
		socket.emit("user-groups", result);
	}

	/**
	 * Adds a rating to the system
	 */
	async function onAddRating(data: RatingData) {
		const [restaurant, group] = await Promise.all([
			findRestaurant(db, data.restaurant),
			findGroup(db, data.group)
		]);
		if(!restaurant || !group) {
			return;
		}
		if(!group.users.find((x) => x.equals(currentUser._id))) {
			return;
		}
		const result = await addRating(db, restaurant._id, currentUser._id, group._id, data.orderedFood, data.comment, data.ratings);
	}

	async function onFindRatings(data: RatingData) {
		const [restaurant, user, group] = await Promise.all([
			findRestaurant(db, data.restaurant),
			data.username ? findUser(db, data.username) : currentUser,
			data.group ? findGroup(db, data.group) : null
		]);
		const restaurantId = restaurant ? restaurant._id : undefined;
		const userId = user ? user._id : undefined;
		const groupId = group ? group._id : undefined;
		const ratings = await findRatings(db, restaurantId, userId, groupId, false);
		if(!ratings || ratings.length === 0) {
			socket.emit("ratings", {
				status: "failed"
			});
			return;
		}
		socket.emit("ratings", {
			status: "ok",
			ratings: ratings.length === 1 ? ratings[0] : ratings
		});
	}

	async function onGetRestaurantScore(data?: {group: string}) {
		// TODO: remove hardcoded group. even though mysterymonday is the only one that matters <3
		const group = await findGroup(db, data ? data.group : undefined, selectedGroupId);
		if(!group) {
			socket.emit("restaurant-score", {
				status: "failed"
			});
			return;
		}
		if(!group.restaurants) {
			socket.emit("restaurant-score", {
				status: "ok",
				restaurants: []
			});
			return;
		}
		const restaurants = group.restaurants.map(x => x._id);
		const result = await getRestaurantsWithAverage(db, restaurants);
		socket.emit("restaurant-score", {
			status: "ok",
			restaurants: result
		});
	}

	async function onGetUsernames() {
		const users = await getUsers(db);
		const usernames = users.map(({username}) => ({
			username
		}));


		socket.emit("users", usernames);
	}
}
