var mongoose = require("mongoose");

var databaseURL = 'mongodb://localhost:27017/yearbook';
mongoose.connect(databaseURL);

var User    = require("../models/user");

var user1 = new User({
  local.username: "marty",
  local.email: "marty@marty.com"
})

user1.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})