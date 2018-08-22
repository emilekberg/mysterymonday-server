import * as fs from "fs";
import * as path from "path";

const cache = new Map<string, string>();

/**
 * output message to the console window, with date time added.
 * @param message some thing to log.
 */
export function log(message: string|object|any[]) {
	// tslint:disable-next-line
	console.log(`${new Date().toISOString()}: ${message}`);
}

/**
 * tries to parse a stringified json into a json objects.
 * return null instead of throwing an exception if it cannot be parsed.
 * @param data stringified json data
 */
export function tryParseJson<T>(data: string): T|{}|null {
	try{
		return JSON.parse(data);
	}
	catch(e) {
		return null;
	}
}

/**
 * Gets a file and caches
 * @param url url to load and cache
 */
export function getFile(url: string, clearCache: boolean = false): string|null {
	let data = cache.get(url);
	if (data && !clearCache) {
		return data;
	}
	try {
		data = fs.readFileSync(url).toString();
	}
	catch {
		return null;
	}
	cache.set(url, data);
	return data;
}
export function getFileAsJson<T extends {}>(url: string): T {
	const file = getFile(url);
	return file ? JSON.parse(file) : null;
}

/**
 * decodes a base64 string
 * @param a string to decode
 */
export function atob(rawString: string): string {
	return new Buffer(rawString, "base64").toString("binary");
}

/**
 * encodes a string to base64
 * @param b string to encode
 */
export function btoao(encodedString: string): string {
	return new Buffer(encodedString).toString("base64");
}

export function toAbsolute(url: string): string
{
	const absolutePath = path.resolve(__dirname, url)
 	return absolutePath;
}

export function getProcessArgument(name: string): string|true
export function getProcessArgument(name: string, defaultValue: string): string
export function getProcessArgument(name: string, defaultValue?: string)
{
	const argv = process.argv;
	for(let i = 2; i < argv.length; ++i) {
		if(argv[i].indexOf('=') > -1) {
			const param = argv[i].substr(0, argv[i].indexOf('='));
			const value = argv[i].substr(argv[i].indexOf('=') + 1);
			if(param === name) {
				return value;
			}
		} else if (argv[i] === name) {
			return true;
		}
	}
	return defaultValue || "";
}