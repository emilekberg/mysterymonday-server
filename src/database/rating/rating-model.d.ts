import {ObjectId} from "mongodb";
export interface Rating {
	score: number;
	comment: string;
}
export interface Ratings {
	taste: Rating;
	service: Rating;
	cozyness: Rating;
	cost: Rating;
}
export default interface RatingModel {
	_id: ObjectId;
	restaurantId: ObjectId;
	userId: ObjectId;
	groupId: ObjectId;
	orderedFood: string;
	comment: string;
	rating: Ratings
}
