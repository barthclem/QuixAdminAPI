/**
 * Created by aanu.oyeyemi on 13/03/2017.
 */
'use strict';

angular.module('messageApp').controller('NavController', ['NavService', 'CookieService', '$location', '$scope', NavController]);

function NavController( navService, cookieService, $location, $scope ) {
    let vm = this;


    vm.displayLogin = true;
    (function () {
        if(status){
            vm.displayLogin = false;
        }
    })(navService.getLogInStatus());
    $scope.$on('loggedInEvent', (event, data)=> {

        if (data.loggedIn === true){
            vm.displayLogin = false;
        }
        else{
            vm.displayLogin= true;
        }
    });

    vm.logOut  = function () {
        console.log(' Log Out ?');
        cookieService.deleteCookie('authentication');
        $location.path('login');
        $scope.$emit('loggedInEvent', { loggedIn: false });
    }

};