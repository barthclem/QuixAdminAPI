/**
 * Created by barthclem on 4/25/17.
 */
'use strict';
let express = require('express');
//let router = require('./routes');
let router = express.Router();
let validate = require('express-validation');
let responseFormatter = require('../lib/responseFormatter');
let AuthMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../config/authorizator');
let constants = require('../config/constants').PERMISSIONS.ROLE_USER;
let userGroup = require('../config/constants').DATA_GROUP.ROLE_USER.title;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let roleUserValidation = require('../validation/roleUserValidation');

module.exports = (app, serviceLocator) => {
    let authMiddleware = new AuthMiddleware(app);
    let roleUserController = serviceLocator.get('roleUserController');

    router.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'application/json');
        next();
    });
    router.route('/').get(
        [authMiddleware.authenticate(), loadRoleMiddleWare(userGroup), authorizer.wants(constants.GET_ROLE_USER)],
        (req, res, next) => {
            roleUserController.listRoleUsers(req, res, next);
            //next();
        })
        .post (validate(roleUserValidation.newRoleUser), (req, res, next)=> {
            roleUserController.createRoleUser(req, res, next);

        });

    router.route('/:id')
        .get([authMiddleware.authenticate(), validate(roleUserValidation.getRoleUser), loadRoleMiddleWare(userGroup),
            authorizer.wants(constants.GET_ROLE_USER)], (req, res, next) => {
            roleUserController.getRoleUser(req, res, next);
            //next();
        })

        .put([authMiddleware.authenticate(), validate(roleUserValidation.editRoleUser), loadRoleMiddleWare(userGroup),
            authorizer.wants(constants.EDIT_USER_ROLE)], (req, res, next) => {
            roleUserController.updateRoleUser(req, res ,next);
        })

        .delete ([authMiddleware.authenticate(), validate(roleUserValidation.getRoleUser), loadRoleMiddleWare(userGroup),
            authorizer.wants(constants.DELETE_USER_ROLE)], (req, res, next) => {
            roleUserController.deleteRoleUser(req, res, next);
        });
    router.route('/user_id/:user_id')
        .get([authMiddleware.authenticate(), validate(roleUserValidation.getRoleUserId), loadRoleMiddleWare(userGroup),
            authorizer.wants(constants.GET_ROLE_USER)], (req, res, next) => {
            roleUserController.getRoleUserByUserId(req, res, next);
            //next();
        })

        .delete ([authMiddleware.authenticate(), validate(roleUserValidation.getRoleUserId), loadRoleMiddleWare(userGroup),
            authorizer.wants(constants.DELETE_USER_ROLE)], (req, res, next) => {
            roleUserController.deleteRoleUserWithId(req, res, next);
        });

    return router;
};