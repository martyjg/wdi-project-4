angular
.module('MySpace')
.factory('CurrentUser', CurrentUser);

CurrentUser.$inject = ["TokenService"]

function CurrentUser(TokenService){

  var user = null

  return {
    getUser: function(){
      return user ? user : TokenService.decodeToken();
    },

    saveUser: function(u){
      return user = u;
    },

    clearUser: function(){
      return user = null;
    }
  }
}


// getUser: function(){
//   // WEIRD, as services are meant to persist data
//   user = TokenService.decodeToken();
//   return user;
// },

// function CurrentUser(TokenService){

//   var user = null;

//   return {

//   }
// }