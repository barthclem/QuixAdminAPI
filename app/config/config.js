/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';
 require('dotenv').config();

 let config = {

     someCherche : {
        data : process.env.CRECHE
     },

     email: {
         gmail:{
             service: 'Gmail',
             username: process.env.USERNAME,
             authenticator: process.env.AUTHENTICATOR
         }
     },
     database : {
         mysql : {
             connection : {
                 database : process.env.DATABASE_NAME,
                 host : process.env.DATABASE_HOST,
                 port : process.env.DATABASE_PORT,
                 user : process.env.DATABASE_USER,
                 password : process.env.DATABASE_PASS

             },
             pool : {
                 min : (process.env.DATABASE_POOL_MIN) ? parseInt(process.env.DATABASE_POOL_MIN) : 1,
                 max : (process.env.DATABASE_POOL_MAX) ? parseInt(process.env.DATABASE_POOL_MAX) : 5
             }
         }
     }
 };


 module.exports = config;