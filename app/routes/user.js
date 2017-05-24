/**
 * Created by barthclem on 4/25/17.
 */
'use strict';
let express = require('express');
//let router = require('./routes');
let router = express.Router();
let validate = require('express-validation');
let responseFormatter = require('../lib/responseFormatter');
let authMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../config/authorizator');
let constants = require('../config/constants').PERMISSIONS.USER;
let userGroup = require('../config/constants').DATA_GROUP.USER.title;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let userValidation = require('../validation/userValidation');


module.exports =  (serviceLocator) => {
    let userService = serviceLocator.get('userService');
    let userController = serviceLocator.get('userController');

    router.use(function (req, res, next) {
        // Website you wish to allow to connect
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'application/json');
        next();
    });

    router.route('/').get(
       [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.GET_ALL_USERS)],
        (req, res, next) => {
        userController.listAll(req, res, next);
        //next();
    })
        .post (validate(userValidation.signUp), (req, res, next)=> {
            userController.createUser(req, res, next);

        });

    router.post('/login',  validate(userValidation.login), (req, res, next) => {
        userController.userLogin(req, res, next);
    });

    router.route('/:id([0-9]+)')
        .get([
            authMiddleware,
            validate(userValidation.getUser)
           , loadRoleMiddleWare(userGroup),
           authorizer.wants(constants.GET_A_USER)
        ], (req, res, next) => {
            userController.getUser(req, res, next);
            //next();
        })

        .put([
            //authMiddleware,
            validate(userValidation.editUser)
          //  , loadRoleMiddleWare(userGroup),
            //authorizer.wants(constants.UPDATE_A_USER)
        ], (req, res, next) => {
            userController.updateUser(req, res ,next);
        })

        .delete ([
            //authMiddleware
            validate(userValidation.getUser),
            //loadRoleMiddleWare(userGroup),
          //  authorizer.wants(constants.DELETE_A_USER)
        ], (req, res, next) => {
            userController.deleteUser(req, res, next);
        });

//get user wi
    router.get('/:username([a-zA-Z0-9_\.]+)', [
       // authMiddleware,
        validate(userValidation.getUser)
        //, loadRoleMiddleWare(userGroup), authorizer.wants(constants.GET_A_USER)
    ], (req, res, next) => {
        userController.getUserByUsername(req, res, next);
        //next();
    });

    // Route to upload file
    router.post('/upload', (req, res, next) => {
        userController.uploadPic(req, res, next);
    });

    return router;
};

//module.exports.route = router;