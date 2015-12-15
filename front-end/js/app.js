angular
  .module("MySpace", ['ngResource', 'angular-jwt', 'ui.router', 'ngFileUpload'])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor')
  })

function MainRouter($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('home', {
    url: "/",
    templateUrl: "home.html"
  })
  .state('profile', {
    url: "/users",
    templateUrl: "profile.html"
  })
  .state('register', {
    url: "/register",
    templateUrl: "register.html"
  })
  .state('album', {
    url: "/users/:id",
    templateUrl: "album.html"
  })
  .state('edit', {
    url: "/users/:id/edit",
    templateUrl: "edit.html"
  })

  $urlRouterProvider.otherwise("/");
}

