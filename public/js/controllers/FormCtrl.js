/**
 * Created by aanu.oyeyemi on 03/03/2017.
 */
"use strict";
angular.module('messageApp').controller('RegistrationController', [ 'RegisterUserService', '$http', '$location',RegistrationController]);

function RegistrationController (RegisterUserService, $http, $location) {
    var vm = this;
    vm.registerData = function () {

        let userRegData = {
            name :vm.fullname,
            email : vm.email,
            username : vm.username,
            password : vm.password
        }

        RegisterUserService.registerUser(userRegData).then(
            data => {
               $location.path('login');
            }
        )
            .catch( () => {
                //show notification
            })

    }
}