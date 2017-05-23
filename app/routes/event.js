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
let userGroup = require('../config/constants').DATA_GROUP.EVENT.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let organizerValidation = require('../validation/organizerValidation');

module.exports = (serviceLocator) => {
    let eventController = serviceLocator.get('eventController');
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
        [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_EVENTS)],
        (req, res, next) => {
            eventController.listAllEvents(req, res, next);
            //next();
        })
        .post ([authMiddleware,  validate(organizerValidation.createOrganizer)],
            (req, res, next)=> {
                eventController.createEvent(req, res, next);
            });

    router.route('/:id([0-9]+)').get(
        [authMiddleware, validate(organizerValidation.getOrganizer), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT)], (req, res, next) => {
            eventController.getEvent(req, res, next);
        })
        .put([authMiddleware, validate(organizerValidation.updateOrganizer), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT)], (req, res, next) => {
            eventController.updateEvent(req, res ,next);
        })
        .delete([authMiddleware, validate(organizerValidation.getOrganizer), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_EVENT_ADMIN)], (req, res, next) => {
            eventController.deleteEvent(req, res, next);
        });

    return router;

};