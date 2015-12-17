angular
.module('MySpace')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', 'CurrentUser', '$state', 'Upload', '$stateParams', '$window'];
function UsersController(User, TokenService, CurrentUser, $state, Upload, $stateParams, $window){

  var self = this;

  if ($stateParams.id) {
    console.log("1.", $stateParams.id);
    showUser($stateParams.id);
  }

  self.file                  = null;
  self.all                   = [];
  self.allComments           = [];
  self.user                  = {};
  self.user.receivedComments = [];
  self.getUsers              = getUsers;
  self.currentUser           = CurrentUser.getUser();
  self.checkCurrentUser      = checkCurrentUser;
  self.getComments           = getComments;
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
      return true
    } else {
      return false;
    }
  }

  function showUser(id) {
    self.inEditMode = false;
    console.log("2", id)
    User.get({id: id}, function(data) {
      self.user = data.user;
      self.user.receivedComments = listUsersComments(self.user);
    })
    // checkCurrentUser(user);
  }

  function editProfile(user) {
    // console.log(currentUser)
    User.update({id: user._id}, user, function(user) {
      console.log(user);
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
    console.log(receiver);
    var receiverId = receiver._id;
    var senderId = self.currentUser._id;
    User.sendFriendRequest({id: receiverId}, self.currentUser, function(user) {
      console.log(user);
      self.currentUser.requests.push(receiverId);
    })
  }

  function getRequests() {
    // self.currentUser.pendingRequests = [];
    // var receiverId = self.currentUser._id;
    // for (i = 0; i < self.all.length; i++) {
    //   for (j = 0; j < self.all[i].requests.length; j++) {
    //     if (self.all[i].requests[j] == receiverId) {
    //       self.currentUser.pendingRequests.push(self.all[i])
    //     }
    //   }
    // }
    // return self.currentUser.pendingRequests
    
    User.pending({id: self.currentUser._id}, function(data) {
      console.log(data);
      return self.currentUser.pendingRequests = data.pending;
    })
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

  function showCommentBox() {
    if (self.inCommentMode === false) {
      return self.inCommentMode = true;
    } else {
      return self.inCommentMode = false;
    }
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
    console.log(self.currentUser._id);
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
    self.getRequests()
  } else {
    console.log("NO CURRENT USER");
  }

  self.getUsers();

  return self;
}