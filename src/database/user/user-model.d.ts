import {ObjectId} from "mongodb";
import HashResult from "../../interfaces/hashresult";

export default interface UserModel {
	_id: ObjectId;
	username: string;
	email: string;
	authentication: {
		password: HashResult;
		token: HashResult;
	};
}
