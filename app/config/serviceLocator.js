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
//let knex = require ('./database');

//Controllers
let CategoryEntryController = require('../controllers/categoryEntryController');
let CategoryController = require('../controllers/categoryController');
let EventAdminController = require('../controllers/eventAdminController');
let EventController = require('../controllers/eventController');
let OrganizerController = require('../controllers/organizerController');
let ParticipantController = require('../controllers/participantController');
let UserController = require('../controllers/userController');
let RoleUserController = require('../controllers/roleUserController');


//Services
let CategoryEntryService = require('../services/categoryEntryService');
let CategoryService = require('../services/categoryService');
let EmailAuthService = require('../services/emailAuth');
let EventAdminService = require('../services/eventAdminService');
let EventService = require('../services/eventService');
let OrganizerService = require('../services/organizerService');
let ParticipantService = require('../services/participantService');
let UserService = require('../services/userService');
let RBACRedisService = require('../services/rbacRedisService');
let RoleUserService = require('../services/roleUserService');
let MailScheduleService = require('../services/mailScheduleService');

//Models
let CategoryEntryModel = require('../models/categoryEntry');
let CategoryModel = require('../models/category');
let EventModel = require('../models/event');
let EventAdminModel = require('../models/eventAdmin');
let OrganizerModel = require('../models/organiser');
let ParticipantModel = require('../models/participant');
let UserModel = require('../models/user');
let Role = require('../models/role');
let RoleUserModel = require('../models/roleUser');
let userVerificationModel = require('../models/userVerification');

module.exports = (()=> {
    /**
     * @description Creates an instance of configuration
     */
    serviceLocator.register('config', () => {
        return require('./config');
    });

    /**
     * @description Creates an instance of a logger
     */
    serviceLocator.register('logger', () => {
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
            client: 'mysql',
            connection: config.database.mysql.connection,
            pool: config.database.mysql.pool
        };
        return databaseConfig;
    });

    /**
     * @description Creates an instance of Email  Model
     */
    serviceLocator.register('emailAuthModel', () => {
        return require('../models/emailAuth');
    });

    /**
     * @description Creates an instance of rbacRedisService
     */
    serviceLocator.register('rbacRedisService', () => {
       return RBACRedisService;
    });

    /**
     * @description Creates an instance of Role User model
     */
    serviceLocator.register('roleUserModel', () => {
        return RoleUserModel;
    });

    /**
     * @description Creates an instance of roleUser Service
     */
    serviceLocator.register('roleUserService', (serviceLocator) => {
        let roleUserModel = serviceLocator.get('roleUserModel');
        return new RoleUserService(Role, roleUserModel);
    });

    /**
     * @description Creates an instance of roleUser Controller
     */
    serviceLocator.register('roleUserController', (serviceLocator) => {
        let roleUserService = serviceLocator.get('roleUserService');
        return new RoleUserController(roleUserService);
    });

    /**
     * @description Creates an instance of user model
     */
    serviceLocator.register('userModel', () => {
        return UserModel;
    });

    /**
     * @description Creates an instance of user model
     */
    serviceLocator.register('userVerificationModel', () => {
        return userVerificationModel;
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
        let emailAuthModel = serviceLocator.get('emailAuthModel');
        return new EmailAuthService(userService, emailModel, emailAuthModel);
    });

    /**
     * @description Creates an instance of User Controller
     */
    serviceLocator.register('userController', (serviceLocator) => {
        let userService = serviceLocator.get('userService');
        let emailAuthService = serviceLocator.get('emailAuthService');
        let roleUserService = serviceLocator.get('roleUserService');
        return new UserController(userService, emailAuthService, roleUserService);

    });

    /**
     * @description Creates an instance of Event model
     */
    serviceLocator.register('eventModel', () => {
        return EventModel;
    });

    /**
     * @description Creates an instance of Event Service
     */
    serviceLocator.register('eventService', (serviceLocator) => {
        let eventModel = serviceLocator.get('eventModel');
        let roleUserService = serviceLocator.get('roleUserService');
        let rbacRedisService = serviceLocator.get('rbacRedisService');
        return new EventService(eventModel, roleUserService, rbacRedisService);
    });

    /**
     * @description Creates an instance of mail scheduling service
     */
    serviceLocator.register('mailScheduleService', (serviceLocator) => {
        let eventService = serviceLocator.get('eventService');
        let emailService = serviceLocator.get('emailAuthService');
        return new MailScheduleService(eventService, emailService);
    });


    /**
     * @description Creates an instance of CategoryEntry model
     */
    serviceLocator.register('categoryEntryModel', () => {
        return CategoryEntryModel;
    });

    /**
     * @description Creates an instance of CategoryEntry Service
     */
    serviceLocator.register('categoryEntryService', (serviceLocator) => {
        let categoryEntryModel = serviceLocator.get('categoryEntryModel');
        let eventModel = serviceLocator.get('eventModel');
        let rbacRedisService = serviceLocator.get('rbacRedisService');
        return new CategoryEntryService(categoryEntryModel, eventModel, rbacRedisService);
    });

    /**
     * @description Creates an instance of Category Entry Controller
     */
    serviceLocator.register('categoryEntryController', (serviceLocator) => {
        let categoryEntryService = serviceLocator.get('categoryEntryService');
        return new CategoryEntryController(categoryEntryService);
    });

    /**
     * @description Creates an instance of Category model
     */
    serviceLocator.register('categoryModel', () => {
        return CategoryModel;
    });

    /**
     * @description Creates an instance of Category Service
     */
    serviceLocator.register('categoryService', (serviceLocator) => {
        let categoryModel = serviceLocator.get('categoryModel');
        let eventModel = serviceLocator.get('eventModel');
        let rbacRedisService = serviceLocator.get('rbacRedisService');
        return new CategoryService(categoryModel, eventModel, rbacRedisService);
    });

    /**
     * @description Creates an instance of Category Controller
     */
    serviceLocator.register('categoryController', (serviceLocator) => {
        let categoryService = serviceLocator.get('categoryService');
        return new CategoryController(categoryService);
    });

    /**
     * @description Creates an instance of EventAdmin model
     */
    serviceLocator.register('eventAdminModel', () => {
        return EventAdminModel;
    });

    /**
     * @description Creates an instance of EventAdmin Service
     */
    serviceLocator.register('eventAdminService', (serviceLocator) => {
        let eventAdminModel = serviceLocator.get('eventAdminModel');
        let roleUserService = serviceLocator.get('roleUserService');
        return new EventAdminService(eventAdminModel, roleUserService);
    });

    /**
     * @description Creates an instance of EventAdmin Controller
     */
    serviceLocator.register('eventAdminController', (serviceLocator) => {
        let EventAdminService = serviceLocator.get('eventAdminService');
        return new EventAdminController(EventAdminService);
    });

    /**
     * @description Creates an instance of Organizer model
     */
    serviceLocator.register('organizerModel', () => {
        return OrganizerModel;
    });

    /**
     * @description Creates an instance of Organizer Service
     */
    serviceLocator.register('organizerService', (serviceLocator) => {
        let organizerModel = serviceLocator.get('organizerModel');
        let eventModel = serviceLocator.get('eventModel');
        let roleUserService = serviceLocator.get('roleUserService');
        return new OrganizerService(organizerModel, eventModel, roleUserService);
    });

    /**
     * @description Creates an instance of Event Controller
     */
    serviceLocator.register('eventController', (serviceLocator) => {
        let EventService = serviceLocator.get('eventService');
        let OrganizerService = serviceLocator.get('organizerService');
        let EmailAuthService = serviceLocator.get('emailAuthService');
        return new EventController(EventService, OrganizerService, EmailAuthService);
    });

    /**
     * @description Creates an instance of Organizer Controller
     */
    serviceLocator.register('organizerController', (serviceLocator) => {
        let OrganizerService = serviceLocator.get('organizerService');
        return new OrganizerController(OrganizerService);
    });

    /**
     * @description Creates an instance of Participant model
     */
    serviceLocator.register('participantModel', () => {
        return ParticipantModel;
    });

    /**
     * @description Creates an instance of Participant Service
     */
    serviceLocator.register('participantService', (serviceLocator) => {
        let participantModel = serviceLocator.get('participantModel');
        let eventService = serviceLocator.get('eventService');
        let roleUserService = serviceLocator.get('roleUserService');
        return new ParticipantService(participantModel, eventService, roleUserService);
    });

    /**
     * @description Creates an instance of Participant Controller
     */
    serviceLocator.register('participantController', (serviceLocator) => {
        let participantService = serviceLocator.get('participantService');
        return new ParticipantController(participantService);
    });
    return serviceLocator;
})();

