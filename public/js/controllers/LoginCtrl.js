/**
 * Created by aanu.oyeyemi on 04/03/2017.
 */
"use strict";
angular.module('messageApp').controller('LoginController',['$location', '$scope', 'LoginService', LoginController] );
function LoginController($location, $scope, loginService) {
    let vm = this;
    vm.count = 0;

    vm.loginry = function (){
        loginService.login({ email: vm.email, password : vm.password}).then(
            result => {
                console.log(`RESULT => ${result}`);
                if(result){
                    $location.path('/');
                    $scope.$emit('messageAlert', {message : 'Successful Log n', type : 'success'})
                }
                else {
                    $scope.$emit('messageAlert', {message : 'username/ password', type : 'danger'});
                }
            }
        )




    };
}