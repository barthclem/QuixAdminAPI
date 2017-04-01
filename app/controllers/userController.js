/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';

class UserController {
    constructor(userService, emailAuthService){
        this.userService = userService;
        this.emailAuthService = emailAuthService;
    }

    createUser (data) {
        //create the user data in the db
        this.userService.createUser(data).then( data => {
            // after the user is saved in the db then email auth is created
            this.emailAuthService.createEmailAuth(data.email, data.username)
                .then( data => { console.log( ` Email Sent +> ${data}`);})
            return data;
        }).catch( error => {
            return error;
        });
    }
}

module.exports = UserController;