angular
  .module('MySpace')
  .factory('CurrentUser', CurrentUser);

CurrentUser.$inject = ["TokenService"]
function CurrentUser(TokenService){

  var user = null;

  return {
    saveUser: function(u){
      return user = u;
    },

    getUser: function(){
      // WEIRD, as services are meant to persist data
      user = TokenService.decodeToken();
      return user;
    },

    clearUser: function(){
      return user = null;
    }
  }
}