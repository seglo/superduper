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
      .when('/oauth', {
        templateUrl: 'views/oauth.html',
        controller: 'OauthCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
