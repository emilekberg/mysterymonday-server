import {ObjectId} from "mongodb";
export default interface RatingModel {
	_id: ObjectId;
	restaurantId: ObjectId;
	userId: ObjectId;
	groupId: ObjectId;
	ratings: {
		food: number;
		service: number;
		cozyness: number;
		price: number;
	};
}
