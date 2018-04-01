import {MongoClient, Db} from "mongodb";
import ConfigInterface from "./interfaces/config";
import {log, getFileAsJson} from "./utils";
export async function open(uri: string): Promise<Db> {
	log("Connecting to database...");
	let client: MongoClient|undefined;
	try {
		client = await MongoClient.connect(uri);
		const database = client.db('mysterymonday');
		log("Connection to database established");
		return Promise.resolve(database);
	} catch(e) {
		if(client) {
			client.close();
		}
		console.warn("closed mongodb due to error", e);
		return Promise.reject(e);
	}
}

