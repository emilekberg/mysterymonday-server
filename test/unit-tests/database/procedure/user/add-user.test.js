const assert = require('assert');
const addUser = require('../../../../../bin/database/procedure/user/add-user').default;
const hash = require('../../../../../bin/hash-utils');
module.exports = function(db) {
	describe("add-user", function() {
		it("#should add a user to database", async function() {
			const result = await addUser(db, "emil", "emil@endpoint.com", {
				hash: "someHash",
				salt: "someSalt"
			});
			assert.equal(result, 0, "expect user to be added to the database");
		});
		it("#should not add if user is already defined", async function() {
			const result = await addUser(db, "emil", "emil@endpoint.com", {
				hash: "someHash",
				salt: "someSalt"
			});
			assert.equal(result, 1, "expect user to be added to the database");
		});
	})
}