var Comment = require("../models/comment");
var User = require("../models/user");

function commentsIndex(req, res){
  Comment.find(function(err, comments){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ comments: comments });
  });
}

function commentsReceived(req, res) {
  Comment.find({ recipient: req.params.id }, function(err, comments) {
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ comments: comments });
  })
}

function commentsCreate(req, res){
  var comment = new Comment(req.body.comment);
  var currentUserId = req.body._id;
  
  User.findById(currentUserId, function(err, user) {
    comment.picture    = user.local.picture;
    comment.username = user.local.username;

    comment.save(function(err) {
      if (err) return res.status(500).send(err);
      user.comments.push(comment);

      user.save(function(err, comment){
        if (err) return res.status(500).send(err);
        return res.status(201).send(comment);
      });
    });
  });
}

module.exports = {
  commentsIndex: commentsIndex,
  commentsCreate: commentsCreate,
  commentsReceived: commentsReceived,
}