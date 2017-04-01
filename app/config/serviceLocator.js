/**
 * Created by aanu.oyeyemi on 01/04/2017.
 */
'use strict';
/**
 * @description This is the Service Locator for the project
 * @type {Locator}
 */
let serviceLocator = require('../../lib/serviceLocator');

let Logger = require('../../lib/logger');
let knex = require ('./database');
let UserController = require('../controllers/userController');


//Services
let EmailAuthService = require('../services/emailAuth');
let UserService = require('../services/userService');

/**
 * @description Creates an instance of configuration
 */
serviceLocator.register('config', ()=>{
    return  require('./config');
});

/**
 * @description Creates an instance of a logger
 */
serviceLocator.register('logger', ()=>{
    return new Logger();
});

/**
 * @description Creates an instance of haylex-mailer
 */
serviceLocator.register('mailer', (serviceLocator) => {
    let config = serviceLocator.get('config');
    let logger = serviceLocator.get('logger');
    return require('../../lib/mailer')(config, logger);
});

/**
 * @description Creates an instance of knex-database
 */
serviceLocator.register('database', (serviceLocator) => {
    let config = serviceLocator.get('config');
    let databaseConfig = {
        client : 'mysql',
        connection : config.database.mysql.connection,
        pool : config.database.mysql.pool
    }
    return require('knex')(databaseConfig);
});

/**
 * @description Creates an instance of user model
 */
serviceLocator.register('userModel', () => {
    return require('../models/user');
});

/**
 * @description Creates an instance of User Service
 */
serviceLocator.register('userService', (serviceLocator) => {
    let userModel = serviceLocator.get('userModel');
    return new UserService(userModel);
});

/**
 * @description Creates an instance of Email Auth Service
 */
serviceLocator.register('emailAuthService', (serviceLocator) => {
   let userService = serviceLocator.get('userService');
   let emailModel = serviceLocator.get('mailer');

   return new EmailAuthService(userService, emailModel);
});

/**
 * @description Creates an instance of Email  Model
 */
serviceLocator.register('emailAuth', () => {
  return require('../models/emailAuth');
});

/**
 * @description Creates an instance of User Controller
 */
serviceLocator.register('userController', (serviceLocator)=> {
  let userService = serviceLocator.get('userService');
  let emailAuthService = serviceLocator.get('emailAuthService');
  return new UserController(userService, emailAuthService);
})


module.exports = serviceLocator;
