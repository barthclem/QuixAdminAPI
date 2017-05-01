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
let userGroup = require('../config/constants').DATA_GROUP.USER;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');

module.exports =  (serviceLocator) => {
    let userService = serviceLocator.get('userService');
    let userController = serviceLocator.get('userController');

    router.use(function (req, res, next) {
        // Website you wish to allow to connect
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    });

    router.route('/').get(
        [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.GET_ALL_USERS)],
        (req, res, next) => {
        userController.listAll(req, res, next);
        //next();
    })
        .post (validate(require('../validation/signup')), (req, res, next)=> {
            userController.createUser(req, res, next);
            next();
        });

    router.post('/login',  validate(require('../validation/login')), (req, res, next) => {
        userController.userLogin(req, res, next);
    });

    router.route('/:id')
        .get([authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.GET_A_USER)], (req, res, next) => {
            userController.getUser(req, res, next);
            next();
        })

        .put([authMiddleware, loadRoleMiddleWare(userGroup),  validate(require('../validation/editUser')), authorizer.wants(constants.UPDATE_A_USER)], (req, res, next) => {
            userController.updateUser(req, res ,next);
            next();
        })

        .delete ([authMiddleware,  loadRoleMiddleWare(userGroup),  authorizer.wants(constants.DELETE_A_USER)], (req, res, next) => {
            userController.deleteUser(req, res, next);
            next();
        });

//get user wi
    router.get('/:username', [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.GET_A_USER)], (req, res, next) => {
        userController.getUserByUsername(req, res, next);
        next();
    });

    // Route to upload file
    router.post('/upload', (req, res, next) => {
        userController.uploadPic(req, res, next);
        next();
    });

    return router;
};

//module.exports.route = router;