angular
.module('MySpace')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', 'CurrentUser', '$state', 'Upload'];
function UsersController(User, TokenService, CurrentUser, $state, Upload){

  var self = this;

  self.file                  = null;
  self.all                   = [];
  self.allComments           = [];
  self.user                  = {};
  self.user.receivedComments = [];
  self.getUsers              = getUsers;
  self.checkCurrentUser      = checkCurrentUser;
  self.getComments           = getComments;
  self.register              = register;
  self.showUser              = showUser;
  self.editProfile           = editProfile;
  self.sendRequest           = sendRequest;
  self.acceptRequest         = acceptRequest;
  self.denyRequest           = denyRequest;
  self.hideRequest           = hideRequest;
  self.getRequests           = getRequests;
  self.saveComment           = saveComment;
  self.login                 = login;
  self.logout                = logout;
  self.checkLoggedIn         = checkLoggedIn;
  self.upload                = upload;

  self.authenticate = function(provider) {
    console.log(provider)
    $auth.authenticate(provider);
  };

  function getUsers() {
    User.query(function(data) {
     return self.all = data.users;
   });
  }

  function getComments() {
    User.commentsQuery(function(data) {
      return self.allComments = data.comments;
    })
  }

  function checkCurrentUser(user) {
    if (user._id == self.currentUser._id) {
      console.log("THIS IS YOUR PAGE");
      return true
    } else {
      console.log("this is not your page :( ");
      return false;
    }
  }

  function showUser(user) {
    var userId = user._id;
    User.get({id: userId}, function(data) {
      self.user = data.user;
      self.user.receivedComments = listUsersComments(self.user);
    })
    // checkCurrentUser(user);
  }

  function editProfile() {
    // console.log(currentUser)
    User.update({id: self.currentUser._id}, self.currentUser, function(user) {
    })
  }

  function sendRequest(receiver) {
    console.log(receiver);
    var receiverId = receiver._id;
    var senderId = self.currentUser._id;
    User.sendFriendRequest({id: receiverId}, self.currentUser, function(user) {
      console.log(user);
      self.currentUser.requests.push(receiverId);
    })
  }

  function getRequests() {
    self.currentUser.pendingRequests = [];
    var receiverId = self.currentUser._id;
    for (i = 0; i < self.all.length; i++) {
      for (j = 0; j < self.all[i].requests.length; j++) {
        if (self.all[i].requests[j] == receiverId) {
          self.currentUser.pendingRequests.push(self.all[i])
        }
      }
    }
    self.currentUser.pendingRequests
  }

  function acceptRequest(user) {
    var index = self.currentUser.pendingRequests.indexOf(user);
    self.currentUser.pendingRequests.splice(index, 1);
    User.acceptFriendRequest({id: user._id}, self.currentUser, function(user) {
      // getRequests();
      // showUser(self.currentUser);
    })
  }

  function denyRequest(user) {
    var index = self.currentUser.pendingRequests.indexOf(user);
    self.currentUser.pendingRequests.splice(index, 1);
    User.denyFriendRequest({id: user._id}, self.currentUser, function(user) {
    })
    // showUser(self.currentUser);
  }

  function saveComment(user) {
    currentTime = Date.now();
    self.currentUser.comment.created_at = currentTime;
    self.currentUser.comment.recipient = user._id;
    user.receivedComment = {
      commenterName: self.currentUser.local.username,
      commenterPicture: self.currentUser.local.picture,
      commentDate: self.currentUser.comment.created_at,
      commentPost: self.currentUser.comment.post
    };
    // var arrayEnd = self.user.receivedComments.length
    // self.user.receivedComments.splice(arrayEnd, 0, user.receivedComment);
    self.user.receivedComments.push(user.receivedComment);
    User.saveComment({id: user._id}, self.currentUser, function(user) {
      // console.log(user.receivedComment);
      self.currentUser.comment.post = "";
    })

  }

  function listUsersComments(user) {
    user.receivedComments = [];
    user.receivedComment = {};
    userId = user._id

    for (var i = 0; i < self.all.length; i++) {
      for (j = 0; j < self.all[i].comments.length; j++) {
        if (self.all[i].comments[j].recipient == user._id) {
          user.receivedComment = {
            commenterName: self.all[i].local.username,
            commenterPicture: self.all[i].local.picture,
            commentDate: self.all[i].comments[j].created_at,
            commentPost: self.all[i].comments[j].post
          }
          user.receivedComments.push(user.receivedComment);
        }
      }
    }

    return user.receivedComments;
  }

  function hideRequest(id) {
    $("#" + id).hide();
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;

    if (token) {
      self.getUsers();
      self.getComments();
      TokenService.setToken(token);
    }

    var user = TokenService.decodeToken();
    self.currentUser = CurrentUser.saveUser(user);
    showUser(self.currentUser);
    $state.go('profile');
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
    console.log("This is working")
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
  } else {
    console.log("NO CURRENT USER");
  }

  self.getUsers();

  return self;
}