/**
 * Created by barthclem on 4/25/17.
 */
'use strict';
let express = require('express');
let router = express.Router();
let validate = require('express-validation');
let responseFormatter = require('../lib/responseFormatter');
let authMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../config/authorizator');
let constants = require('../config/constants').PERMISSIONS.EVENT;
let userGroup = require('../config/constants').DATA_GROUP.EVENTADMIN.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let eventAdminValidation = require('../validation/eventAdminValidation');

module.exports = (serviceLocator) => {
    let eventAdminController = serviceLocator.get('eventAdminController');
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
        [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_EVENT_ADMINS)],
        (req, res, next) => {
            eventAdminController.listAllEvents(req, res, next);
            //next();
        })
        .post ([authMiddleware,  validate(eventAdminValidation.createEventAdmin)],
            (req, res, next)=> {
                eventAdminController.createEventAdmin(req, res, next);
            });

    router.route('/:id([0-9]+)').get(
        [authMiddleware, validate(eventAdminValidation.getEventAdmin), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT_ADMIN)], (req, res, next) => {
            eventAdminController.getEventAdmin(req, res, next);
        })
        .put([authMiddleware, validate(eventAdminValidation.editEventAdmin), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_EVENT_ADMIN)], (req, res, next) => {
            eventAdminController.updateEventAdmin(req, res ,next);
        })
        .delete([authMiddleware, validate(eventAdminValidation.getEventAdmin), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_EVENT_ADMIN)], (req, res, next) => {
            eventAdminController.deleteEventAdmin(req, res, next);
        });
    //TODO improve the loadMiddleWare to cater for more complicated route such as /user/
    router.get('/user/:userId([0-9]+)', [authMiddleware, validate(eventAdminValidation.getEventAdmin),
        loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_AN_EVENT_ADMIN)],
        (req, res, next)=> {
            eventAdminController.getEventAdminByUserId(req, res, next);
        });

    router.get('/event/:userId([0-9]+)', [authMiddleware, validate(eventAdminValidation.getEventAdmin),
        loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_AN_EVENT_ADMIN)],
        (req, res, next)=> {
            eventAdminController.getEventAdminByEventId(req, res, next);
        });
    return router;

};