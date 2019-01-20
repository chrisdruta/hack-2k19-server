var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/ourdb", {useNewUrlParser: true});
module.exports = mongoose;
