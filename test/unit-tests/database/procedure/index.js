const user = require('./user');
module.exports = function(db) {
	describe("procedure", function() {
		user(db);
	});
}