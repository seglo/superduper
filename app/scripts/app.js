'use strict';

angular
  .module('superduperApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dupe', {
        templateUrl: 'views/dupe.html',
        controller: 'DupeCtrl'
      })
      .when('/oauth', {
        templateUrl: 'views/oauth.html',
        controller: 'OauthCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
