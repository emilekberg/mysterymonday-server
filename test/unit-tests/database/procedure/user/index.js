const addUser = require('./add-user.test');
module.exports = function(db) {
	describe("user", function() {
		addUser(db);
	});
}
