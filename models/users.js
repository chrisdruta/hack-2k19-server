var db = require("../db");

var userSchema = new db.Schema({
	username: {
		type: String,
		required: true
	},
	log: {
		type: Array
	},
	prescription: Object,
	machineRedCount: Number,
	machineBlueCount: Number
});

var User = db.model("User", userSchema);
module.exports = User;
