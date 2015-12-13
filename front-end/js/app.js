angular
  .module("MySpace", ['ngResource', 'angular-jwt', 'ui.router', 'satellizer'])
  .constant('API', 'http://localhost:3000/api')
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor')
  })