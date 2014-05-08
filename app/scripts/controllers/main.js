'use strict';

angular.module('superduperApp')
  .controller('MainCtrl', function($scope, $log, $window, RedditApi) {
    $scope.beginOauth = function() {
      $window.location.href = RedditApi.authorizeUrl();
    };
  });