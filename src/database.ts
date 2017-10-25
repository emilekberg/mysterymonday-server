import {MongoClient, Db} from "mongodb";
import ConfigInterface from "./interfaces/config";
import {log, getFileAsJson} from "./utils";
let database: Db;
export async function open(uri: string): Promise<Db> {
	const client: MongoClient = new MongoClient();
	try {
		database = await client.connect(uri);
		log("Connection to database established");
		return Promise.resolve(database);
	} catch(e) {
		return Promise.reject(e);
	}
}

export async function close() {
	await database.close();
	log("database connection closed");
}
