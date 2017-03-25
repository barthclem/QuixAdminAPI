/**
 * Created by aanu.oyeyemi on 13/03/2017.
 */
'use strict';

angular.module('messageApp').controller('NavController', ['NavService', '$scope', NavController]);

function NavController( navService, $scope ) {
    let vm = this;


    vm.displayLogin = true;
    (function () {
        if(status){
            vm.displayLogin = false;
        }
    })(navService.getLogInStatus());
    $scope.$on('loggedInEvent', (event, data)=> {
        console.log(`Log In Event is received => ${JSON.stringify(data)}`);
        if (data.loggedIn === true){
            vm.displayLogin = false;
        }
        else{
            vm.displayLogin= true;
        }
    })
};