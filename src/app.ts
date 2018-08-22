import * as database from "./database";
import Config from "./interfaces/config";
import {log, getFileAsJson, getFile, toAbsolute, getProcessArgument} from "./utils";
import {setPepper} from "./hash-utils";
import startServer from "./server";
import * as path from 'path';
import {Db} from "mongodb";

let configPath = getProcessArgument("config", "./config.json");
if(!path.isAbsolute(configPath)) {
	configPath = toAbsolute(configPath);
}
log(`trying to load config from ${configPath}...`);
const config = getFileAsJson<Config>(configPath);

if (!config) {
	log("config.json does not exist. Create one following the config interface");
	process.exit(1);
}
log("config loaded!");
if(config.pepper) {
	setPepper(config.pepper);
}

(async () => {
	let db: Db;
	try {
		db = await database.open(config.mongodb.uri);
		startServer(config, db);
	}
	catch(e) {
		log(`error! ${e}`);
	}
})();
