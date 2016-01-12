var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  recipient: { type: mongoose.Schema.ObjectId, ref: "User" },
  post: String,
  created_at: Number,
  username: String,
  picture: String
});

module.exports = mongoose.model('Comment', commentSchema);

