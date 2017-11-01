const assert = require("assert");
const hashUtils = require("../../bin/hash-utils");
describe("hash-utils", function() {
	let someResult = {};
	const someStringToHash = "someCoolString";
	const someInvalidStringToVerify ="thisIsCrap";
	before(async function() {
		someResult = await hashUtils.createHash(someStringToHash);
	});
	it("#should return a object with a hash and a salt", function() {
		assert.equal(typeof someResult.hash, "string", "result should have a hash string");
		assert.notEqual(someResult.hash, "", "hash string should contain something");
		assert.equal(typeof someResult.salt, "string", "result should have a salt string");
	});
	it("#should hash strings", async function() {
		assert.notEqual(someStringToHash, someResult.hash, "should return a hashed string");
	});
	it("#should recreate and verify hash from result", async function() {
		const isEqualHash = await hashUtils.verifyHash(someStringToHash, someResult);
		assert.equal(isEqualHash, true, "hash should be equal");
	});
	it("#should reject when data is invalid", async function() {
		const isEqualHash = await hashUtils.verifyHash("invalidStringToVerify", someResult);
		assert.equal(isEqualHash, false, "hash should not be equal");
	});
	it("#should generate different hash when changing pepper", async function() {
		hashUtils.setPepper("someRandomNewPepper");
		const someOtherResult = await hashUtils.createHash(someInvalidStringToVerify);
		assert.notDeepEqual(someResult, someOtherResult, "should not be equal");
	});
});