angular
  .module('MySpace')
  .controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', 'CurrentUser', '$state'];
function UsersController(User, TokenService, CurrentUser, $state){

  var self = this;

  self.all           = [];
  self.user          = {};
  self.getUsers      = getUsers;
  self.register      = register;
  self.editProfile   = editProfile;
  self.login         = login;
  self.logout        = logout;
  self.checkLoggedIn = checkLoggedIn;

  self.authenticate = function(provider) {
    $auth.authenticate(provider);
  };

  function getUsers() {
    User.query(function(data){
     return self.all = data.users;
   });
  }

  function editProfile() {
    console.log("The button is working")
    // console.log(currentUser)
    User.update({id: self.user._id}, self.user ,function(user) {
      console.log(user)
    })
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if (token) {
      self.getUsers();
      $state.go('profile');
    }
    // console.log(res);
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

  if (CurrentUser.getUser()) {
    self.getUsers();
    self.user = TokenService.decodeToken();
  }

return self
}