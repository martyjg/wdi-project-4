var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');
var Comment  = require('./comment');

var userSchema = mongoose.Schema({
  local: {
    username: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    fullname: { type: String},
    picture: { type: String },
    general: { type: String},
    music: { type: String},
    films: { type: String},
    television: { type: String},
    books: { type: String},
    tagline: { type: String},
    mood: { type: String},
    location: { type: String}
  },
  requests: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  // comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }]
  comments: [Comment.schema]
});

userSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", userSchema);
