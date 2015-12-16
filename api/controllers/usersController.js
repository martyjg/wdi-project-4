var User   = require('../models/user');

function usersIndex(req, res) {
  User.find(function(err, users){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ users: users });
  });
}

function usersShow(req, res){

  User.findById(req.params.id).populate("requests").populate("friends").exec(function(err, user) {
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ user: user });
  })
}

function usersUpdate(req, res){
  User.findById(req.params.id,  function(err, user) {
    if (err) return res.status(500).json({message: "Something went wrong!"});
    if (!user) return res.status(404).json({message: 'No user found.'});
    console.log(req.body)

    if (req.body.local.email) user.local.email = req.body.local.email;
    if (req.body.local.password) user.local.password = req.body.local.password;
    if (req.body.local.username) user.local.username = req.body.local.username;
    if (req.body.local.fullname) user.local.fullname = req.body.local.fullname;
    if (req.body.local.picture) user.local.picture = req.body.local.picture;
    
    user.save(function(err) {
     if (err) return res.status(500).json({message: "Something went wrong!"});

     res.status(201).json({message: 'User successfully updated.', user: user});
   });
  });
}

function usersSendFriendRequest(req, res) {

  var sender     = req.body;
  var receiverId = req.params.id;

  User.findById(sender._id, function(err, user){
    for (i = 0; i < user.requests.length; i++) {
      if (user.requests[i] == receiverId) {
        console.log("Already exists", receiverId)
        return res.status(500).json({ message: "Something went wrong!" })
      }
    }
    user.requests.push(receiverId);
    user.save(function(err){
      if (err) return res.status(500).json({message: "Something went wrong!"});

      res.status(201).json({message: 'Request Sent.'});
    })
  })

}

function usersAcceptFriendRequest(req, res) {
  var currentUserId = req.body._id;
  var requesteeId = req.params.id
  User.findById(currentUserId, function(err, user) {
    user.friends.push(requesteeId)
    user.save(function(err){
      if (err) return res.status(500).json({message: "Something went wrong!"});
    })
  })
  User.findById(requesteeId, function(err, user) {
    user.requests.pull(currentUserId);
    user.friends.push(currentUserId);
    user.save(function(err){
      if (err) return res.status(500).json({message: "Something went wrong!"});

      res.status(201).json({message: 'Requested Accepted.', user: user});
    })
  })
}


function usersDenyFriendRequest(req, res) {
  var currentUserId = req.body._id;
  User.findById(req.params.id, function(err, user) {
    for (i = 0; i < user.requests.length; i++) {
      if (user.requests[i] == currentUserId) {
        user.requests.pull(currentUserId)
      }
    }
    user.save(function(err){
      if (err) return res.status(500).json({message: "Something went wrong!"});

      res.status(201).json({message: 'Request Sent.', user: user});
    })
  })
}


module.exports = {
  usersIndex:  usersIndex,
  usersShow: usersShow,
  usersUpdate: usersUpdate,
  usersSendFriendRequest: usersSendFriendRequest,
  usersAcceptFriendRequest: usersAcceptFriendRequest,
  usersDenyFriendRequest: usersDenyFriendRequest
}