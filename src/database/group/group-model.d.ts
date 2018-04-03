import { ObjectId } from "mongodb";
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
export interface ReviewModel {
	userId: ObjectId,
	orderedFood: string,
	comment: string,
	rating: Ratings
}
export interface RestaurantModel {
	_id: ObjectId;
	visited: boolean;
	reviews: Array<ReviewModel>;
}
export default interface GroupModel {
	_id: ObjectId;
	name: string;
	users: ObjectId[];
	restaurants: Array<RestaurantModel>;
}
