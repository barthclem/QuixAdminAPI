/**
 * Created by aanu.oyeyemi on 11/03/2017.
 */
'use strict';

angular.module('messageApp').service('LoginService', ['$http', LoginService]);

function LoginService ($http) {
    this.login = function (data) {
        console.log(`Sending data => ${data}`);
        return new Promise ( (resolve, reject) => {
            $http.post('/users/login', data).then((loginData) => {
                console.log(`Response Login Message => ${loginData.data.isCorrect}`);
                console.log(`Response Login Message Object => ${JSON.stringify(loginData)}`);
                return resolve(loginData.data.isCorrect);
            })
                .catch(error => {
                console.log(`Login Error => ${error}`);
                return reject(error);
            })
            });
    }
}