/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';
let authCodeGenerator = require('node-uuid');
let moment = require('moment');
let constant = require('../config/constants').UTILITY;

class EmailAuth {
    /**
     *
     * @param {object} userService - an instance of user service
     * @param {object} mailer - mail sender function
     * @param {object} emailAuthModel - an instance of email authentication model
     */
    constructor (userService, mailer, emailAuthModel) {
        this.mailer = mailer;
        this.userService = userService;
        this.emailAuthModel = emailAuthModel;
    }

    /**
     *
     * @param {string} emailAddress - the email address of the intended recipient
     * @param {string} authCode - the authentication token to be sent to the recipient
     * @return {function} mailer - this function sends message to the recipient
     */
    sendAuthMail ( emailAddress ,  authCode) {
        return this.mailer({
            from: 'Event Tiers',
            to: emailAddress,
            subject: 'Event Registration',
            html: `<div><h2>Welcome to Message App Platform</h2>
            <br/><br/>
            <p> Please use the link to activate your account<br/>
            <a href="http://localhost:8000/api/user/verify/${authCode}">Click this link to activate your account </a>
            </p></div>`
        });
    }

    /**
     *
     * @param {string} emailAddress - the email address of the organizer of the event
     * @param {string} eventTitle - the title of the newly created event
     * @param {string} eventLink - the link through which a new participant for the event
     * @return {function} mailer - this function sends message to the recipient
     */
    sendNewEventMail ( emailAddress , eventTitle, eventLink) {
        return this.mailer({
            from: 'Event Platform',
            to: emailAddress,
            subject: 'New Event Creation Notice',
            html: `<div><h2>Event ${eventTitle} Created</h2>
            <br/><br/>
            <p> Your event has been created<br/>
            Give this <a href="http://localhost:8000/api/participant/${eventLink}"> link </a> out for users to 
            register for your event 
            </p></div>`
        });
    }

    /**
     *
     * @param {string} email - the email of a new user for who email verification is created
     * @return {Promise}
     */
    createEmailAuth ( email) {
    let authCode = authCodeGenerator.v4();
    let data = { email : email , email_auth_code : authCode};
    return new Promise((resolve, reject)=> {
        this.userService.getUserByEmail(email)
        .then( user => {
            //after the email auth is saved in the database ... send the auth to user
            user.related('emailAuth').create(data).then( () => {
                this.sendAuthMail(email, authCode)
                    .then(() => {
                        return resolve(data);
                    })
                    .catch( error => {
                        console.log(`Email Failure Message => ${error}`);
                    });
            })
                .catch(
                    error => {
                        console.log(`Unable to fetch user => ${error}`);
                    });
              })
        .catch(error => {
            console.log(`Email Saved Error => ${error}`);
            return reject(error); });
    });
    }

    getEmailAuth ( email ) {
        return new Promise((resolve, reject) => {
            this.userService.getUserByEmail(email).related('emailAuth').fetch()
                .then( data => { return resolve(data);})
                .catch(error => { return reject(error);});
    });
    }

    updateEmailAuth ( email ) {
        return new Promise((resolve, reject) => {
            let authCode = authCodeGenerator.v4();
            return this.userService.getUserByEmail(email).related('emailAuth').save(
                {email: email, email_auth_code: authCode})
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description verify a email authentication code
     *
     *@param {integer}  emailAuthCode - a string containing the verification token for a particular user
     * @return {object} Error/Data
     */
    verifyUserEmail (emailAuthCode) {
        return new Promise((resolve, reject) => {
            return this.emailAuthModel.forge({email_auth_code : emailAuthCode}).fetch()
                .then(data => {
                    let storedAuthCode = data.attributes.email_auth_code;
                    if (emailAuthCode === storedAuthCode) {
                        let expirationDate = moment(data.attributes.created_at).add(1, 'days');
                        console.log(` Email Data => ${JSON.stringify(data)}`);
                        console.log(`Service UPDATE status is here => ${moment().isBefore(expirationDate)}`);
                        if(moment().isBefore(expirationDate)){
                            this.userService.updateUserStatus(data.attributes.email, constant.VERIFIED)
                                .then(()=> {
                                    console.log(` \n\n\nUserService update status => ${constant.VERIFIED}\n\n\n`);
                                    data.destroy();
                                    return resolve(constant.VERIFIED);
                                })
                                .catch(error => {
                                    console.log(`User Update Error => ${error}`);
                                });
                        }
                       else{
                            return resolve(constant.UNVERIFIED);
                        }
                    }
                })
                .catch(error => {
                        console.log(`Error Message => ${error}`);
                        return reject(error);
                    }
                );
        });
    }

    /**
     *
     *@description Delete a participant
     *
     *@param  {integer} emailAuthCode - a string containing the email verification token of a user
     *
     * @return {object} object - an object containing message/error
     */
    deleteUserVerificationEntry (emailAuthCode) {
        return new Promise((resolve, reject) => {
            return this.emailAuthModel.forge({email_auth_code: emailAuthCode}).destroy().then(
                data => {
                    console.log(`DELETE USER Verification Entry ERROR => ${data}`);
                    return resolve(` User Verification Entry${emailAuthCode} deleted successfully`);
                })
                .catch(error => {
                    console.log(`DELETE USER Verification Entry ERROR => ${error}`);
                    return  reject(` unable to delete user verification entry with  id ${emailAuthCode}`);
                });
        });
    }
}

module.exports = EmailAuth;
