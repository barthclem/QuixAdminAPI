/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';
let users = require('../models/user');
let cryptor = require('bcrypt-nodejs');
let config = require('../config/config');

/**
 *@description this is class handles all action that can be performed by a participant
 */
 class UserService {

    /**
     *
     *@description Organizer Service Constructor
     *
     *@param  {object} user - User model instance
     *
     */
     constructor(users){
         this.users = users;
     }

    /**
     *
     *@description Get All Users
     *
     * @return {object} a newly created participant object
     */
     getAllUsers () {
         return this.users.forge().fetchAll().then(
             data => { return data;}
         )
             .catch(error => {

                 throw error;
             })
     };

    /**
     *
     *@description Get A User
     *
     *@param {Integer}  userId - Integer containing user identification
     * @return {object} Error/Data
     */
     getUser (id) {
         return this.users.forge({id :id}).fetch().then(
             data => { return data;}
         )
             .catch(
                 error => { throw error;}
             );
     }
    /**
     *
     *@description Get A User
     *
     *@param {String}  username - Username df a user
     * @return {object} Error/Data
     */
     getUserByUsername (username) {
         return this.users.forge({username :username}).fetch().then(
             data => { return data;}
         )
             .catch(
                 error => { throw error;}
             );
     }


    /**
     *
     *@description Get A User
     *
     *@param {String}  email - Email of a user
     * @return {object} Error/Data
     */
     getUserByEmail (email) {
         return this.users.forge({email : email}).fetch().then(
             data => { return data;}
         )
             .catch(
                 error => { throw error;}
             );
     }

     /**
      *
      *@description Create a user
      *
      *@param  {object} userData - Object containing user registration data
      *
      * @return {object} a newly created user object
      */
     createUser ( userData ) {
         userData.password = cryptor.hashSync(userData.password, config.someCherche.data);
         return this.users.forge().save(userData).then(
             data => {
                 //this sends authorization email to the newly reg member
                 return data;
             }
         )
             .catch (error => {
                 console.log( ` Error creating user ${error}`);
                 throw error;
             });
     }

    /**
     *
     *@description Log a User into the system
     *
     *@param  {object} userData - Object containing user login data
     *
     * @return {object} promise - A promise object containing data/errpr
     */
     loginUser (userData) {
         return new Promise((resolve, reject) => {
             this.getUserByEmail(userData.email).then((data) => {
                 cryptor.compare(userData.password, data.attributes.password, (error, data)=>{
                     return resolve(data);
                 });
             }).catch( error =>
                 {return reject(error);}
             );
         });

     }

     /**
      *
      *@description update a user data in the database
      *
      *@param  {object} userData - Object containing new user data
      *@param {Integer}  Id - Integer containing user identification
      * @return {object} a newly created participant object
      */
     updateUser (id, userData ) {
         return this.users.forge({id : id}).save(userData).then(
             data => { return data;}
         )
             .catch(error => {
                 throw error;
             })
     }

    /**
     *
     *@description Delete a participant
     *
     *@param  {Integer} userId - the ID of user
     *
     * @return {object} object - an object containing message/error
     */
     deleteUser (id) {
         return this.users.forge({id : id}).destroy().then(
             data => { return ` User ${id} deleted successfully`;}
         )
             .catch(error => {
                 throw    ` unable to delete user with  id ${id}`;
             })
     }


}

module.exports = UserService;