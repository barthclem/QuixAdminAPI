/**
 * Created by aanu.oyeyemi on 04/03/2017.
 */
'use strict';
angular.module('messageApp').controller('LoginController', ['$location', '$scope', '$rootScope', 'CookieService', 'LoginService', LoginController]);
function LoginController($location, $scope, $rootScope, cookieService, loginService) {
    let vm = this;
    vm.count = 0;

    vm.loginry = function () {
        loginService.login({ email: vm.email, password: vm.password }).then(
            result => {
                if (result) {
                    //store the authentication data in the cookies
                    if (vm.remember === true) {
                        cookieService.setCookie('authentication', {
                            email: vm.email,
                            password: vm.password
                        });

                        //inform the nav controller of the update
                        $rootScope.$broadcast('loggedInEvent', { loggedIn: true });
                    }

                    $location.path('listMyEvent');
                    $scope.$emit('messageAlert', { message: 'Successful Log n', type: 'success' });
                } else {
                    $scope.$emit('messageAlert', { message: 'username/ password', type: 'danger' });
                }
            }
        );

    };

    vm.logOut = function () {
        cookieService.deleteCookie('authentication');
        $location.path('login');
        $scope.$emit('loggedInEvent', { loggedIn: false });
    };

    vm.signUp = function () {
        $location.path('registration');
    };

}
