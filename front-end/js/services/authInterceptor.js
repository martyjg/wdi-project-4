angular
.module('MySpace')
.factory('authInterceptor', AuthInterceptor);

// Like in insomnia this sets the header for our request so API can know we're authorized

AuthInterceptor.$inject = ['API', 'TokenService'];
function AuthInterceptor(API, TokenService) {

  return {
    request: function(config){
      var token = TokenService.getToken();

      if (config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      else if (config.url === "http://localhost:3000/api/users" && config.method === "GET") {
        config.headers.Authorization = 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsIl9pZCI6IjU2NmVkOGI0NzdhNzRjZDQ2MGM0ODhjNSIsImxvY2FsIjp7InBhc3N3b3JkIjoiJDJhJDA4JG5zc2w3ZzRUVFFTNmlPRTA3MXFpWWVFMFhDeFNESFB1dXhPNlBDZzJTQXNXc3RIcXVMUGYuIiwidXNlcm5hbWUiOiJNQVJUVFkiLCJlbWFpbCI6Im1hcnR5QGZha2UuY29tIn19.5rO8eiRjHBJAnCTqlSZur5lalZeGq34EWUGRJlvBcCE";
      }
    return config;
  },
  response: function(res){
    if (res.config.url.indexOf(API) === 0 && res.data.token) {
      TokenService.setToken(res.data.token);
    }
    return res;
  }
}
}