var Comment = require("../models/comment");
var User = require("../models/user");

function commentsIndex(req, res){
  Comment.find({}, function(err, comments) {
    if (err) return res.status(404).send(err);
    res.status(200).send(comments);
  });
}

function commentsCreate(req, res){

  console.log(req.body);
  console.log("this is res: " + res);
  // var recipientId = req.params.id;
  // console.log("this is the recipient id, " + recipientId)
  //params should be the target user
  //body should be the current user lol

  // var comment = new Comment(req.body.comment);
  // comment.save(function(err){
  //   if (err) return res.status(500).send(err);
  //   var id = req.body.comment.user_id;
  //   User.findById(id, function(err, user){
  //      user.comments.push(comment);
  //      user.save();
  //      return res.status(201).send(comment)
  //   });
  // });
}

module.exports = {
  commentsIndex: commentsIndex,
  commentsCreate: commentsCreate
}