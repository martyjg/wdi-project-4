var User   = require('../models/user');

function usersIndex(req, res) {
  User.find(function(err, users){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ users: users });
  });
}

function usersShow(req, res){
  User.findById(req.params.id).populate("requests").exec(function(err, user) {
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
    // if (req.body.requests) {
    //   for (i = 0; i < user.requests.length; i++) {
    //     for (j = 0; j < req.body.requests.length; j++) {
    //       if (user.requests[i] != req.body.requests[j]) {
    //         var newRequest = req.body.requests[j];
    //       }
    //     }
    //   }
    //   user.requests.push(newRequest);
    // }

    //   // for (i = 0; i < req.body.requests.length; i++) {
    //   //   for (j = 0; j < user.requests.length; j++) {
    //   //     if (req.body.requests[i] !== user.requests[j]) {
    //   //       user.requests.push(req.body.requests[i]);
    //   //     } else {
    //   //       console.log("friend request already sent");
    //   //     }
    //   //   }
    //   // }

    user.save(function(err) {
     if (err) return res.status(500).json({message: "Something went wrong!"});

     res.status(201).json({message: 'User successfully updated.', user: user});
   });
  });
}

function usersSendFriendRequest(req, res) {
  var currentUser = req.body;
  User.findById(req.params.id, function(err, user){
    for (i = 0; i < user.requests.length; i++) {
      if (user.requests[i] == currentUser._id) {
        console.log("Already exists", currentUser)
        return res.status(500).json({ message: "Something went wrong!" })
      }
    }
    user.requests.push(currentUser);

  })
}

function usersDenyFriendRequest(req, res) {
  var deniedUserId = req.body._id
  User.findById(req.params.id, function(err, user) {
    for (i = 0; i < user.requests.length; i++) {
      if (user.requests[i] == deniedUserId) {
        user.requests.pull(deniedUserId);
        console.log(user.requests);
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
  usersDenyFriendRequest: usersDenyFriendRequest
}