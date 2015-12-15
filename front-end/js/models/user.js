angular
.module("MySpace")
.factory('User', User)

User.$inject = ['$resource', 'API']
function User($resource, API){

  return $resource(
    API + '/users/:id', 
    {id: '@id'},
    { 'get':       { method: 'GET' },
    'save':        { method: 'POST' },
    'query':       { method: 'GET', isArray: false},
    'remove':      { method: 'DELETE' },
    'delete':      { method: 'DELETE' },
    'sendFriendRequest': { url: API + '/users/:id' + "/friendrequest", method: "PUT" },
    'update':      { method: 'PUT' },
    'register':    { url: API + '/register', method: "POST" },
    'login':       { url: API + '/login', method: "POST" }
    }
  );
}