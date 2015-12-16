angular
.module('MySpace')
.controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', 'CurrentUser', '$state', 'Upload'];
function UsersController(User, TokenService, CurrentUser, $state, Upload){

  var self = this;

  self.file          = null;
  self.all           = [];
  self.user          = {};
  self.getUsers      = getUsers;
  self.register      = register;
  self.showUser      = showUser;
  self.editProfile   = editProfile;
  self.sendRequest   = sendRequest;
  self.acceptRequest = acceptRequest;
  self.denyRequest   = denyRequest;
  self.hideRequest   = hideRequest;
  self.getRequests   = getRequests;
  self.saveComment   = saveComment;
  self.login         = login;
  self.logout        = logout;
  self.checkLoggedIn = checkLoggedIn;
  self.upload        = upload;

  self.authenticate = function(provider) {
    console.log(provider)
    $auth.authenticate(provider);
  };

  function getUsers() {
    User.query(function(data) {
     return self.all = data.users;
   });
  }

  function showUser(user) {
    var userId = user._id;
    User.get({id: userId}, function(data) {
      self.user = data.user;
    })
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
    currentTime = Date.now()
    console.log("This is the recipient user", user.local.username);
    console.log("This is the current user", self.currentUser.local.username)
    console.log("Created_at", currentTime);
    User.saveComment({})
  }

  function hideRequest(id) {
    $("#" + id).hide();
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;

    if (token) {
      self.getUsers();
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