import {promisify} from "util";
import * as crypto from "crypto";
import HashResult from "./interfaces/hashresult";
const pbkdf2 = promisify(crypto.pbkdf2);
const settings = {
	iterations: 1000,
	keylength: 512,
	digest: "sha512",
	pepper: "someAwesomePepper",
	saltLength: 128
};

/**
 * resets the pepper to a new value. Useful when not wanting to use the standard pepper, and for instance to use one for different servers.
 * @param pepper pepper
 */
export function setPepper(pepper: string) {
	settings.pepper = pepper;
}

/**
 * Creates a hashed version of the string passed in and return the hash and the salt given.
 * @param stringToHash string to hash
 */
export async function createHash(stringToHash: string): Promise<HashResult> {
	const salt = crypto.randomBytes(settings.saltLength).toString("base64");
	stringToHash += settings.pepper;
	const hash = (await pbkdf2(stringToHash, salt, settings.iterations, settings.keylength, settings.digest)).toString("base64");
	return {
		hash,
		salt
	};
}

/**
 * Verifies given string against a hashResult.
 * @param stringToVerify string to verify.
 * @param verifyHashResult hashed result returned by createHash function to verify against.
 */
export async function verifyHash(stringToVerify: string, verifyHashResult: HashResult): Promise<boolean> {
	stringToVerify += settings.pepper;
	const hash = (await pbkdf2(stringToVerify, verifyHashResult.salt, settings.iterations, settings.keylength, settings.digest)).toString("base64");
	return hash === verifyHashResult.hash;
}
