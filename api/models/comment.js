var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  recipient: { type: mongoose.Schema.ObjectId, ref: "User" },
  post: String,
  created_at: { type: Date }
});

module.exports = mongoose.model('Comment', commentSchema);
