var Comment = require("../models/comment");
var User = require("../models/user");

function commentsIndex(req, res){
  Comment.find(function(err, comments){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ comments: comments });
  });
}

function commentsCreate(req, res){
  var comment = new Comment(req.body.comment);
  comment.save(function(err) {
    if (err) return res.status(500).send(err);
    var currentUserId = req.body._id;
    User.findById(currentUserId, function(err, user) {
      user.comments.push(comment);
      user.save();
      return res.status(201).send(comment);
    });
  });
}

module.exports = {
  commentsIndex: commentsIndex,
  commentsCreate: commentsCreate
}