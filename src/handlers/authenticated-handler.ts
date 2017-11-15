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

/**
 * Adds a number of listeners on the socket that handles authenticated connections.
 * @param db db instance
 * @param socket socket instance
 * @param user the authenticated user
 */
export default async function handleAuthenticatedConnection(db: Db, socket: SocketIO.Socket, currentUser: UserModel) {

	socket.on("add-restaurant", onAddRestaurant);
	socket.on("get-restaurants", onGetRestaurants);
	socket.on("add-group", onAddGroup);
	socket.on("add-to-group", onAddToGroup);
	socket.on("add-rating", onAddRating);
	socket.on("find-ratings", onFindRatings);
	socket.on("get-restaurants-score", onGetRestaurantScore);

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
		if(!group.members.find((x) => x.equals(currentUser._id))) {
			return;
		}
		const result = await addRating(db, restaurant._id, currentUser._id, group._id, data.orderedFood, data.comment, data.ratings);
	}

	async function onFindRatings(data: RatingData) {
		const [restaurant, user, group] = await Promise.all([
			findRestaurant(db, data.restaurant),
			data.username ? findUser(db, data.username) : currentUser,
			findGroup(db, data.group)
		]);
		const restaurantId = restaurant ? restaurant._id : undefined;
		const userId = user ? user._id : undefined;
		const groupId = group ? group._id : undefined;
		const ratings = await findRatings(db, restaurantId, userId, groupId, false);
		if(!ratings) {
			socket.emit("ratings", {
				status: "failed"
			});
			return;
		}
		if(ratings.length === 1) {
			socket.emit("ratings", {
				status: "ok",
				ratings: ratings[0]
			});
			return;
		}
		socket.emit("ratings", {
			status: "ok",
			ratings
		});
	}

	async function onGetRestaurantScore(data: RestaurantData) {
		const result = await getRestaurantsWithAverage(db);
		socket.emit("restaurant-score", result);
	}

	/*
	await onAddRating({
		comment: "smakar bra!",
		group: "MysteryMonday",
		orderedFood: "Lax",
		restaurant: "jallajalla",
		ratings: {
			cost: {
				comment: "rätt billigt alltså!",
				score: 4
			},
			cozyness: {
				comment: "rätt sunkigt...",
				score: 1
			},
			service: {
				comment: "gick snabbt",
				score: 3
			},
			taste: {
				comment: "kunde smaka bättre",
				score: 2
			}
		}
	});
	await onAddRating({
		comment: "smakar bra!",
		group: "MysteryMonday",
		orderedFood: "Lax",
		restaurant: "börjes",
		ratings: {
			cost: {
				comment: "hyffsat pris!",
				score: 3
			},
			cozyness: {
				comment: "sjukt mysigt på ett sätt :)",
				score: 4
			},
			service: {
				comment: "gick snabbt",
				score: 3
			},
			taste: {
				comment: "top notch!",
				score: 4
			}
		}
	});
	*/
}
