angular.module("MySpace", [])
  .controller("YoutubesController", YoutubesController);

YoutubesController.$inject = ["$http"];
function YoutubesController($http) {
  var self = this;
  self.all = [];
  self.getYoutube = getYoutube;

  function getYoutube() {

  }
}