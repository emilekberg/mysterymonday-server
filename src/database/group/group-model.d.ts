import { ObjectId } from "mongodb";

export default interface GroupModel {
	_id: ObjectId;
	name: string;
	members: ObjectId[];
	restaurants: Array<{_id: ObjectId; visited: boolean;}>;
}
