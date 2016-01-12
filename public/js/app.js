angular
  .module("MySpace", ['ngResource', 'angular-jwt', 'ui.router', 'ngFileUpload'])
  .constant('API', '/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor')
  })

function MainRouter($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('home', {
    url: "/",
    templateUrl: "home.html",
    controller: "UsersController as users"
  })
  .state('profile', {
    url: "/users/:id",
    templateUrl: "profile.html",
    controller: "UsersController as users"
  })
  .state('register', {
    url: "/register",
    templateUrl: "register.html",
    controller: "UsersController as users"
  })
  .state('album', {
    url: "/users",
    templateUrl: "album.html",
    controller: "UsersController as users"
  })
  .state('edit', {
    url: "/users/:id/edit",
    templateUrl: "edit.html",
    controller: "UsersController as users"
  })

  $urlRouterProvider.otherwise("/");
}

