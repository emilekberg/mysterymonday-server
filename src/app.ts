import * as database from "./database";
import Config from "./interfaces/config";
import {log, getFileAsJson, getFile} from "./utils";
import {setPepper} from "./hash-utils";
import startServer from "./server";
const config = getFileAsJson<Config>("config.json");
if (!config) {
	log("config.json does not exist. Create one following the config interface");
	process.exit(1);
}

if(config.pepper) {
	setPepper(config.pepper);
}

(async () => {
	try {
		const db = await database.open(config.mongodb.uri);
		startServer(config, db);
	}
	catch(e) {
		log(`error! ${e}`);
		database.close();
	}
})();
