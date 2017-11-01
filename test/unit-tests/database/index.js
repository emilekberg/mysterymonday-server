const procedure = require("./procedure");
module.exports = function(db) {
	describe("database", function() {
		procedure(db);
	});

}