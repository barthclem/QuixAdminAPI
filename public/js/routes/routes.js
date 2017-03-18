'use strict';
 angular.module('messageApp')
.config(
 function Router ($routeProvider , $locationProvider)
{
    $routeProvider
        .when('/registration', {
            templateUrl : 'partials/registration.html',
            controller : 'RegistrationController',
            controllerAs: '$rctrl'
        })
        .when('/login', {
            templateUrl : 'partials/login.html',
            controller : 'LoginController',
            controllerAs: '$lctrl'
        })
        .when('/profile', {
            templateUrl : 'partials/profile.html',
            controller : 'ProfileController',
            controllerAs : '$pctrl'
        })
        .when('/validate', {
            templateUrl : 'partials/validate.html',
        })
        .otherwise({
            templateUrl : 'partials/welcome.html'
            });


    $locationProvider.html5Mode(true);

});