/**
 * Created by barthclem on 4/25/17.
 */
'use strict';
let express = require('express');
let router = express.Router();
let validate = require('express-validation');
let responseFormatter = require('../lib/responseFormatter');
let AuthMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../config/authorizator');
let constants = require('../config/constants').PERMISSIONS.EVENT;
let userGroup = require('../config/constants').DATA_GROUP.EVENTADMIN.id;
let eventGroup = require('../config/constants').DATA_GROUP.EVENT.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let eventAdminValidation = require('../validation/eventAdminValidation');

module.exports = (app, serviceLocator) => {
    let authMiddleware = new AuthMiddleware(app);
    let eventAdminController = serviceLocator.get('eventAdminController');
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
        [authMiddleware.authenticate(), loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_EVENT_ADMINS)],
        (req, res, next) => {
            eventAdminController.listAllEventAdmin(req, res, next);
            //next();
        })
        .post([authMiddleware.authenticate(),  validate(eventAdminValidation.createEventAdmin)],
            (req, res, next)=> {
                eventAdminController.createEventAdmin(req, res, next);
            });

    router.route('/:id').get(
        [authMiddleware.authenticate(), validate(eventAdminValidation.getEventAdmin), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT_ADMIN)], (req, res, next) => {
            eventAdminController.getEventAdmin(req, res, next);
        })
        .put([authMiddleware.authenticate(), validate(eventAdminValidation.editEventAdmin), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_EVENT_ADMIN)], (req, res, next) => {
            eventAdminController.updateEventAdmin(req, res, next);
        })
        .delete([authMiddleware.authenticate(), validate(eventAdminValidation.getEventAdmin), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_EVENT_ADMIN)], (req, res, next) => {
            eventAdminController.deleteEventAdmin(req, res, next);
        });
    //TODO improve the loadMiddleWare to cater for more complicated route such as /user/
    router.get('/user/:userId', [authMiddleware.authenticate(), validate(eventAdminValidation.getEventAdmin),
        loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_AN_EVENT_ADMIN)],
        (req, res, next)=> {
            eventAdminController.getEventAdminByUserId(req, res, next);
        });

    router.get('/event/:eventId', [authMiddleware.authenticate(), validate(eventAdminValidation.getEventAdmin),
        loadRoleMiddleWare(eventGroup, true, 'eventId'), authorizer.wants(constants.VIEW_AN_EVENT_ADMIN)],
        (req, res, next)=> {
            eventAdminController.getEventAdminByEventId(req, res, next);
        });

    router.get('/allEvent/:userId', [authMiddleware.authenticate(), validate(eventAdminValidation.getEventAdmin),
        loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_ALL_EVENTS)],
        (req, res, next)=> {
            eventAdminController.getAllEventsEventAdminByUserId(req, res, next);
        });
    return router;

};
