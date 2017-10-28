import * as MongoDB from "mongodb";
import HashResult from "../../interfaces/hashresult";

export default interface UserModel {
	_id: MongoDB.ObjectId;
	username: string;
	email: string;
	authentication: {
		password: HashResult;
		token: HashResult;
	};
	// TODO: change this type once proper implemented.
	groups: string[];
}
