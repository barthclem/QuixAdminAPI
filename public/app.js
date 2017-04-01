/**
 * Created by aanu.oyeyemi on 03/03/2017.
 */
'use strict';
var app = angular.module('messageApp', ['ngRoute', 'ngMessages', 'ngCookies', 'ngResource', 'ngSanitize', 'ui.router'])
    .controller('RootController', ['$rootScope', RootController])
    .run([ '$location', 'CookieService', 'LoginService', 'NavService', FirstRun]);

function RootController ($rootScope) {
    //this handles broadcasting of events
    $rootScope.$on('rootBroadcast', (event, data) => {
        console.log(`RootBroadcast Event (-_-)`);
        let broadcast = data.broadcast;
        delete data.broadcast;
        $rootScope.$broadcast(broadcast, data);
    })
}

function FirstRun( $location, cookieService, loginService, navService ) {

     let data = cookieService.getCookie('authentication');
     if(data){
         loginService.login(data).then((response) => {
             if(response) {
                 $location.path('listMyEvent');
                 navService.setLogInStatus(true);
             }else{
                 $location.path('login');
             }
         }).catch(
             error => {
                 navService.setLogInStatus(false);
             }
         )
     }

    //direct the nav controller to update the view if there a user cred is in the cookies
}