import { Db, ObjectId } from "mongodb";
import getRestaurants from "../database/procedure/restaurant/get-restuarants";
import RestaurantData from "../interfaces/restaurant-data";
import addRestaurant from "../database/procedure/restaurant/add-restaurant";
import { AddResult } from "../database/procedure/constants";

export default function handleAuthenticatedConnection(db: Db, socket: SocketIO.Socket, userId: ObjectId) {
	// TODO: Add authenticated functionality
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

}
