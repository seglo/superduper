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
  var baseSslUrl = 'https://ssl.reddit.com';
  var baseOAuthUrl = 'https://oauth.reddit.com';

  var redirectUrlRaw = 'chrome-extension://kpejbeodolcebjppdefdjkimpbnbegjd/app/index.html#/oauth/';
  var redirectUrl = $window.encodeURIComponent(redirectUrlRaw);
  var redditAuth = {
    clientId: '53oJ1lNXSfkB0A',
    clientSecret: 'heukJEuqHtIetb8E6CsbZ9kyHTg'
  };

  var get = function(url, config) {
    url = baseOAuthUrl + url;
    return $http.get(url, config).error(logError);
  };

  var post = function(url, params, config) {
    url = baseOAuthUrl + url;
    return $http.post(url, params, config).error(logError);
  };

  var logError = function(data, status, headers, config) {
    $log.error('Error: ' + data);
  };

  var redditAccessTokenConfig = function() {
    return {
      headers: {
        'Authorization': 'Basic ' + btoa(redditAuth.clientId + ':' + redditAuth.clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      withCredentials: true,
      transformRequest: [

        function(data) {
          return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }
      ]
    }
  };

  var redditAuthConfig = function() {
    return {
      headers: {
        'Authorization': 'bearer ' + redditAuth.accessToken
        //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        //"X-Testing": "testing"
        /* 'Access-Control-Allow-Origin': redirectUrlRaw,
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type'*/
      },
      withCredentials: true,
      transformRequest: [

        function(data) {
          return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }
      ]
    }
  };


  /*
   * Encode request data like jQuery.post (formdata)
   * http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
   */
  var param = function(obj) {
    var query = '',
      name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
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
      return baseSslUrl + '/api/v1/authorize?client_id=' + redditAuth.clientId + '&response_type=code&state=123&redirect_uri=' + redirectUrl + '&duration=temporary&scope=identity,read,mysubreddits';
    },
    getAccessToken: function(code) {
      return $http.post(baseSslUrl + '/api/v1/access_token', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrlRaw
      }, redditAccessTokenConfig())
        .then(
          function(result) {
            redditAuth.accessToken = result.data.access_token;
          },
          function(result) {
            // an error occurred
          });
    },
    getApiMe: function() {
      return get('/api/v1/me', redditAuthConfig());
    },
    getApiMeJq: function() {
      $.ajax({
        type: "GET",
        url: 'https://oauth.reddit.com/api/v1/me',
        crossDomain: true,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + redditAuth.accessToken)
        }
      }).done(function(data) {
        alert(data);
      }).fail(function(response) {
        alert('failed to "get me"');
      });
    },
    isAuthenticated: function() {
      return angular.isDefined(redditAuth.accessToken);
    }
    /*    getAccessTokenJquery: function(code) {
      $.ajax({
        type: "POST",
        url: 'https://ssl.reddit.com/api/v1/access_token',
        data: {
          code: code,
          redirect_uri: redirectUrlRaw,
          grant_type: 'authorization_code'
        },
        username: redditAuth.clientId,
        password: redditAuth.clientSecret,
        crossDomain: true,
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + btoa(redditAuth.clientId + ":" + redditAuth.clientSecret));
        }
      });
    }*/
  };
});
/*jshint unused: true */
/*jshint camelcase: true */