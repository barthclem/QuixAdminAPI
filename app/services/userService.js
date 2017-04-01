/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';
let users = require('../models/user');
let cryptor = require('bcrypt-nodejs');
let config = require('../config/config');
 class UserService {

     constructor(users){
         this.users = users;
     }

     getAllUsers () {
         return this.users.forge().fetchAll().then(
             data => { return data;}
         )
             .catch(error => {

                 throw error;
             })
     };

     getUser (id) {
         return this.users.forge({id :id}).fetch().then(
             data => { return data;}
         )
             .catch(
                 error => { throw error;}
             );
     }

     getUserByUsername (username) {
         return this.users.forge({username :username}).fetch().then(
             data => { return data;}
         )
             .catch(
                 error => { throw error;}
             );
     }

     getUserByEmail (email) {
         return this.users.forge({email : email}).fetch().then(
             data => { return data;}
         )
             .catch(
                 error => { throw error;}
             );
     }

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

     updateUser (id, userData ) {
         return this.users.forge({id : id}).save(userData).then(
             data => { return data;}
         )
             .catch(error => {
                 throw error;
             })
     }

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