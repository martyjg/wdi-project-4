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
    console.log(CurrentUser.CurrentLoggedIn);
    var userId = user._id;
    User.get({id: userId}, function(data) {
      self.user = data.user;
    })
  }

  function editProfile() {
    // console.log(currentUser)
    User.update({id: self.user._id}, self.user, function(user) {
    })
  }

  function sendRequest(user) {
    self.user = user;
    var userId = user._id;
    var currentUserId = CurrentUser.CurrentLoggedIn._id;
    self.user.requests.push(CurrentUser.CurrentLoggedIn._id);
    User.sendFriendRequest({id: self.user._id}, CurrentUser.CurrentLoggedIn, function(user) {
      console.log(user);
    })
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if (token) {
      self.getUsers();
      $state.go('profile');
    }
    self.user = TokenService.decodeToken();
    CurrentUser.saveUser(self.user)
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
    self.getUsers();
    self.user = TokenService.decodeToken();
  }

  self.getUsers();

return self
}