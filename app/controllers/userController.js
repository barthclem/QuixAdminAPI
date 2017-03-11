/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';
let UserService = require('../services/userService');
let userService = new UserService();
let emailAuthService = require('../services/emailAuth');
class UserController {
    constructor(){}

    createUser (data) {
        //create the user data in the db
        userService.createUser(data).then( data => {
            // after the user is saved in the db then email auth is created
            emailAuthService.createEmailAuth(data.email, data.username)
                .then( data => { console.log( ` Email Sent +> ${data}`);})
            return data;
        }).catch( error => {
            return error;
        });
    }
}

module.exports = (() => {
    return new UserController();
})();