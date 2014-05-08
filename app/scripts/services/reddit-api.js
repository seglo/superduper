'use strict';

/*jshint camelcase: false */
/*jshint unused: false */
angular.module('superduperApp')
/*  .config(function($httpProvider) {
    // needed for reddit oauth post to get access token
    // http://stackoverflow.com/questions/23136536/reddit-oauth-with-angularjs
    //    headers['Access-Control-Allow-Origin'] = 'http://localhost'
    //$httpProvider.defaults.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    //$httpProvider.defaults.headers['Access-Control-Allow-Headers'] = '*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type'
    //$httpProvider.defaults.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:9000';
    //$httpProvider.defaults.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    //$httpProvider.defaults.headers['Access-Control-Allow-Headers'] = '*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type';
    //$httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.post = {'Content-Type': 'application/text'};
  })*/
  .factory('RedditApi', function RedditApi($http, $log, $window) {
    var baseUrl = 'https://ssl.reddit.com';
    var redirectUrl = $window.encodeURIComponent('http://127.0.0.1:9000/#/oauth');

    var get = function(url) {
      url = baseUrl + url;
      return $http.get(url).error(logError);
    };

    var post = function(url, params) {
      url = baseUrl + url;
      return $http.jsonp(url, {
        params: params
      }).error(logError);
    };

    var logError = function(data, status, headers, config) {
      $log.error('Error: ' + data);
    };

    return {
      /*
        OAuth
        Example OAuth url:
        https://ssl.reddit.com/api/v1/authorize?client_id=D5Am3ca6FMHZYg&response_type=code&state=123&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2F%23%2Foauth&duration=temporary&scope=mysubreddits
          redirect_uri needs to be URL escaped first
        Get tips from Google Client side OAuth tutorial for tips on completing oauth in JS


        https://ssl.reddit.com/api/v1/access_token?grant_type=authorization_code&code=tFUckywoZArz6eSn1D7Q6VY4cb4&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2F%23%2Foauth
        Get subreddits with returned oauth access key
        qe-bF6uDRHvW3w4QKssHrb-bjHo
        https://ssl.reddit.com/api/v1/subreddits/mine/subscriber.json

      */
      authorizeUrl: function() {
        return baseUrl + '/api/v1/authorize?client_id=D5Am3ca6FMHZYg&response_type=code&state=123&redirect_uri=' + redirectUrl + '&duration=temporary&scope=mysubreddits';
      },
      getAccessToken: function(code) {
        return post('/api/v1/access_token', {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUrl
        });
      }
    };
  });
/*jshint unused: true */
/*jshint camelcase: true */