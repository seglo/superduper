'use strict';

angular.module('superduperApp')
  .factory('RedditApi', function RedditApi($log) {
    return {
      login: function(username, password) {
        $log.info('username: ' + username);
        return password;
      }
    };
  });