angular
  .module("MySpace", ['ngResource', 'angular-jwt', 'ui.router'])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor')
})

function MainRouter($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('profile', {
    url: "/",
    templateUrl: "profile.html"
  })

  $urlRouterProvider.otherwise("/");
}