'use strict';

angular.module('superduperApp')
  .controller('MainCtrl', function($scope, $log, $window, redditApi) {
    if (redditApi.isAuthenticated()) {
      angular.element('#debugCall,#debugGet').removeAttr('disabled');
    }

    $scope.authorizeApp = function() {
      $window.location.href = redditApi.authorizeUrl();
    };

    $scope.debug = function() {
      redditApi.get($scope.debugCall).then(function(result) {
        $scope.debugResponse = JSON.stringify(result.data, undefined, 2);
      });
    };
  });