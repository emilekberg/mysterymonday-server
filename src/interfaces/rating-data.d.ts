import {ObjectId} from "mongodb";
import {Ratings} from "../database/rating/rating-model";
export default interface RatingData {
	restaurant: string;
	username?: string;
	group: string;
	orderedFood: string;
	comment: string;
	ratings: Ratings;
}
