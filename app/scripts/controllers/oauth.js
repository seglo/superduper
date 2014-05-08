'use strict';

/*jshint camelcase: false */
angular.module('superduperApp')
  .run(function($window) {
    // TODO: move this util method somewhere more appropriate

    // can't parse out query string parameter using $location service
    // because reddit puts it before the hash bang of the url and 
    // https://github.com/angular/angular.js/issues/6172
    $window.location.getQueryVar = function(varName) {
      var queryStr = $window.unescape($window.location.search) + '&';
      var regex = new RegExp('.*?[&\\?]' + varName + '=(.*?)&.*');
      var val = queryStr.replace(regex, '$1');
      return val === queryStr ? false : val;
    };
  })
  .controller('OauthCtrl', function($scope, $window, $log, RedditApi) {
    var code = $window.location.getQueryVar('code');
    RedditApi.getAccessToken(code).then(function(result) {
      $log.info('Access token' + result.access_token);
    });
  });
/*jshint camelcase: true */