/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';
angular.module('messageApp').service('RegisterUserService', ['$http', registerUserService]);

function registerUserService($http) {
    this.registerUser = function (data) {
        return new Promise((resolve, reject) => {
            $http.post('http://localhost:8000/api/user/', data).then(
                data => {
                    return resolve(data);
                })
                .catch(error => {
                    console.log(`Response Error => ${error}`);
                    return reject(error);
                });
        });
    };

};
