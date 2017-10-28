import {ObjectId} from "mongodb";

export default interface RestaurantModel {
	_id: ObjectId;
	name: string;
}
