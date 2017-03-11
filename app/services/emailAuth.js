/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';

let UserService = require('./userService');
let userService = new UserService();
let mailer = require('../../lib/mailer')();
let authCodeGenerator = require('node-uuid');

class EmailAuth {
    constructor () {}
    sendAuthMail ( emailAddress , username, authCode) {
        return mailer({
            from: 'Event Tiers',
            to: emailAddress,
            subject: 'Event Registration',
            html: `<div><h2>Welcome to Message App Platform</h2>
            <br/><br/>
            <p> Please use the link to activate your account<br/>
            <a href="http://localhost:8000/users/${username}/${authCode}">Click this link to activate your account </a>
            </p></div>`
        });
    }

    createEmailAuth ( email, username ) {
    let authCode = authCodeGenerator.v4();
    let data = { email : email , email_auth_code : authCode};
    return userService.getUserByEmail(email)
        .then( user => {
            //after the email auth is saved in the database ... send the auth to user
            user.related('emailAuth').create(data).then( (result) => {
                this.sendAuthMail(email, username, authCode).then(
                ).catch( error => {console.log(`Email Failure Message => ${error}`)});
                return data;
            })
                .catch(
                    error => {
                        console.log(`Unable to fetch user => ${error}`);
                    }
                )


        })
        .catch(error => {
            console.log(`Email Saved Error => ${error}`);
            return error });
    }

    getEmailAuth ( email ) {
    return userService.getUserByEmail(email).related('emailAuth').fetch()
        .then( data => { return data})
        .catch(error => { return error});
    }

    updateEmailAuth ( email ) {
    let authCode = authCodeGenerator.v4();
    return userService.getUserByEmail(email).related('emailAuth').save(
        { email : email , email_auth_code : authCode})
        .then( data => { return data})
        .catch(error => { return error});
    }
}

module.exports = EmailAuth;