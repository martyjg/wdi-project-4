angular
.module('MySpace')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', 'CurrentUser', '$state', 'Upload', '$stateParams', '$window'];
function UsersController(User, TokenService, CurrentUser, $state, Upload, $stateParams, $window){

  var self = this;

  if ($stateParams.id) {
    showUser($stateParams.id);
  }

  self.file                  = null;
  self.all                   = [];
  self.allComments           = [];
  self.user                  = {};
  self.settingUser           = {};
  self.user.receivedComments = [];
  self.getUsers              = getUsers;
  self.currentUser           = CurrentUser.getUser();
  self.checkCurrentUser      = checkCurrentUser;
  // self.getComments           = getComments;
  self.register              = register;
  self.showUser              = showUser;
  self.editProfile           = editProfile;
  self.editMode              = editMode;
  self.inEditMode            = false;
  self.sendRequest           = sendRequest;
  self.acceptRequest         = acceptRequest;
  self.denyRequest           = denyRequest;
  self.hideRequest           = hideRequest;
  self.getRequests           = getRequests;
  self.showCommentBox        = showCommentBox;
  self.inCommentMode         = false;
  self.saveComment           = saveComment;
  self.login                 = login;
  self.logout                = logout;
  self.checkLoggedIn         = checkLoggedIn;
  self.upload                = upload;

  self.authenticate = function(provider) {
    $auth.authenticate(provider);
  };

  function getUsers() {
    User.query(function(data) {
     return self.all = data.users;
   });
  }

  // function getComments() {
  //   User.commentsQuery(function(data) {
  //     return self.allComments = data.comments;
  //   })
  // }

  function checkCurrentUser(user) {
    if (user._id == self.currentUser._id) {
      return true
    } else {
      return false;
    }
  }

  function showUser(id) {
    self.inEditMode = false;
    User.get({id: id}, function(data) {
      User.received({id: id}, function(comments){
        data.user.receivedComments = comments.comments;
        self.user = data.user;
      })
    })
  }

  function editProfile(user) {
    User.update({id: user._id}, user, function(user) {
      //?
    })
  }

  function editMode() {
    if (self.inEditMode === false) {
      return self.inEditMode = true;
    } else {
      return self.inEditMode = false;
    }
  }

  function sendRequest(receiver) {
    var receiverId = receiver._id;
    var senderId = self.currentUser._id;
    User.sendFriendRequest({id: receiverId}, self.currentUser, function(user) {
      self.currentUser.requests.push(receiverId);
    })
  }

  function getRequests() {
    User.pending({id: self.currentUser._id}, function(data) {
      return self.currentUser.pendingRequests = data.pending;
    })
  }

  function acceptRequest(user) {
    var index = self.currentUser.pendingRequests.indexOf(user);
    self.currentUser.pendingRequests.splice(index, 1);
    User.acceptFriendRequest({id: user._id}, self.currentUser, function(user) {
    })
  }

  function denyRequest(user) {
    var index = self.currentUser.pendingRequests.indexOf(user);
    self.currentUser.pendingRequests.splice(index, 1);
    User.denyFriendRequest({id: user._id}, self.currentUser, function(user) {
    })
  }

  function showCommentBox() {
    if (self.inCommentMode === false) {
      return self.inCommentMode = true;
    } else {
      return self.inCommentMode = false;
    }
  }

  /* Saving a new comment */
  function saveComment(user) {
    var currentTime = Date.now();
    self.currentUser.comment.created_at = currentTime;
    self.currentUser.comment.recipient = user._id;

    user.receivedComment = {
      username: self.currentUser.local.username,
      picture: self.currentUser.local.picture,
      created_at: self.currentUser.comment.created_at,
      post: self.currentUser.comment.post
    };
    
    // var arrayEnd = self.user.receivedComments.length
    // self.user.receivedComments.splice(arrayEnd, 0, user.receivedComment);
    self.user.receivedComments.push(user.receivedComment);
    
    User.saveComment({id: user._id}, self.currentUser, function(user) {
      // console.log(user.receivedComment);
      self.currentUser.comment.post = "";
    })

  }


  // function listUsersComments(user) {
  //   console.log("listUsersComments(user)");

  //   // user.receivedComments = [];
  //   user.receivedComment = {};
  //   userId = user._id

  //   // console.log(self.allComments)
  //   for (var i = 0; i < self.all.length; i++) {
  //     for (j = 0; j < self.all[i].comments.length; j++) {
  //       if (self.all[i].comments[j].recipient == user._id) {
  //         user.receivedComment = {
  //           commenterName: self.all[i].local.username,
  //           commenterPicture: self.all[i].local.picture,
  //           commentDate: self.all[i].comments[j].created_at,
  //           commentPost: self.all[i].comments[j].post
  //         }
  //         user.receivedComments.push(user.receivedComment);
  //       }
  //     }
  //   }

  //   return user.receivedComments;
  // }

  function hideRequest(id) {
    $("#" + id).hide();
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;

    if (!token) return $state.go('register');

    self.getUsers();
    TokenService.setToken(token);
    self.currentUser = TokenService.decodeToken();
    console.log(self.currentUser._id);

    CurrentUser.saveUser(self.currentUser);
    $state.go('profile', { id: self.currentUser._id });
    return self.currentUser;
  }

  function register() {
    User.register(self.user, handleLogin);
  }

  function login() {
    User.login(self.user, handleLogin);
  }

  function logout() {
    TokenService.removeToken();
    self.all  = [];
    self.user = {};
    CurrentUser.clearUser();
  }

  function checkLoggedIn() {
    var loggedIn = !!TokenService.getToken();
    return loggedIn;
  }

  function upload() {
    Upload.upload({
      url: 'http://localhost:3000/upload',
      data: { file: self.file }
    }).then(function(res) {
      console.log("Success!");
      console.log(res);
    })
    .catch(function(err) {
      console.error(err);
    });
  }

  if (CurrentUser.getUser()) {
    self.currentUser = CurrentUser.getUser();
    self.getUsers();
    self.getRequests()
  } else {
    console.log("NO CURRENT USER");
  }

  self.getUsers();

  return self;
}