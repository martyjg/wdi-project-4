var Comment = require("../models/comment");
var User = require("../models/user");

function commentsIndex(req, res){
  Comment.find({}, function(err, comments) {
    if (err) return res.status(404).send(err);
    res.status(200).send(comments);
  });
}

function commentsCreate(req, res){
  var comment = new Comment(req.body.comment);
  comment.save(function(err){
    if (err) return res.status(500).send(err);
    var id = req.body.comment.user_id;
    User.findById(id, function(err, user){
       user.comments.push(comment);
       user.save();
       return res.status(201).send(comment)
    });
  });
}

module.exports = {
  commentsIndex: commentsIndex,
  commentsCreate: commentsCreate
}