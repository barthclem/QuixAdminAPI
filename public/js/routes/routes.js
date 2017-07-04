'use strict';
angular.module('messageApp')
.config(
function Router($stateProvider, $locationProvider, $urlRouterProvider)
{
    $urlRouterProvider.otherwise('/listMyEvent');
    $stateProvider
        .state('registration', {
            url: '/registration',
            templateUrl: 'partials/signUp.html',
            controller: 'RegistrationController',
            controllerAs: '$rctrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
            controllerAs: '$lctrl'
        })
        .state('validate', {
            url: 'validate',
            templateUrl: 'partials/validate.html'
        })
        .state('listMyEvent', {
            url: '/listMyEvent',
            templateUrl: 'partials/listEvent.html',
            controller: 'EventController'
        });
    $locationProvider.html5Mode(true);

});
