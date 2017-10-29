import { Db, ObjectId } from "mongodb";
import getRestaurants from "../database/procedure/restaurant/get-restuarants";
import RestaurantData from "../interfaces/restaurant-data";
import GroupData from "../interfaces/group-data";
import addRestaurant from "../database/procedure/restaurant/add-restaurant";
import { AddResult, UpdateResult } from "../database/procedure/constants";
import findUser from "../database/procedure/user/find-user";
import addUserToGroup from "../database/procedure/user/add-user-to-group";
import addGroup from "../database/procedure/user/add-group";
import UserModel from "../database/models/user-model";

export default function handleAuthenticatedConnection(db: Db, socket: SocketIO.Socket, user: UserModel) {
	socket.on("add-restaurant", async (data: RestaurantData) => {
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
	});
	socket.on("get-restaurants", async () => {
		const result = await getRestaurants(db, false);
		socket.emit("restaurants", result);
	});
	socket.on("add-group", async (data: GroupData) => {
		if(!data.usersToAdd.includes(user.username)) {
			data.usersToAdd.push(user.username);
		}
		const result = await addGroup(db, data.groupName, data.usersToAdd);
	});
	socket.on("add-to-group", async (data: GroupData) => {
		const addedUsers: string[] = [];
		data.usersToAdd.forEach(async (userName) => {
			const userToAdd = await findUser(db, userName);
			if(!userToAdd) {
				return;
			}
			const result = await addUserToGroup(db, data.groupName, user._id, userToAdd._id);
			if(result !== UpdateResult.Ok) {
				return;
			}
			addedUsers.push(userName);
		});
		socket.emit("added-to-group", {
			status: "ok",
			addedUsers
		});
	});
}
