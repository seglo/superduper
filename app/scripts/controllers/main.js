'use strict';

angular.module('superduperApp')
  .controller('MainCtrl', function($scope, $log, $window, RedditApi) {
    if (RedditApi.isAuthenticated()) {
      angular.element('#getUserInfo').removeAttr('disabled');
    }

    $scope.authorizeApp = function() {
      $window.location.href = RedditApi.authorizeUrl();
    };

    $scope.getUserInfo = function() {
      RedditApi.getApiMe().then(function(result) {
        $scope.userInfo = JSON.stringify(result.data, undefined, 2);
      });
    };
  });