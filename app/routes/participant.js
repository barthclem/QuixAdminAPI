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
let constants = require('../config/constants').PERMISSIONS.PARTICIPANT;
let userGroup = require('../config/constants').DATA_GROUP.PARTICIPANT.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let participantValidation = require('../validation/participantValidation');

module.exports = (serviceLocator) => {
    let participantController = serviceLocator.get('participantController');

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
        [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_PARTICIPANTS)],
        (req, res, next) => {
            participantController.listAllParticipants(req, res, next);
            //next();
        })
        .post ([authMiddleware,  validate(participantValidation.createParticipant)],
            (req, res, next)=> {
            participantController.createParticipant(req, res, next);
        });

    router.route('/:id([0-9]+)').get(
        [authMiddleware, validate(participantValidation.getParticipant), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_A_PARTICIPANT)], (req, res, next) => {
            participantController.getParticipant(req, res, next);
        })
        .put([authMiddleware, validate(participantValidation.updateParticipant), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_A_PARTICIPANT)], (req, res, next) => {
            participantController.updateParticipant(req, res ,next);
        })
        .delete([authMiddleware, validate(participantValidation.getParticipant), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_A_PARTICIPANT)], (req, res, next) => {
            participantController.deleteParticipant(req, res, next);
        });

    router.get('/data/:user_id([0-9]+)', [authMiddleware, validate(participantValidation.getParticipant),
            loadRoleMiddleWare(userGroup, true),authorizer.wants(constants.VIEW_A_PARTICIPANT)],
        (req, res, next) => {
            participantController.getParticipantDataByUserId(req, res, next);
        });

    router.get('/events/:user_id([0-9]+)', [authMiddleware, validate(participantValidation.getParticipant),
            loadRoleMiddleWare(userGroup, true),authorizer.wants(constants.VIEW_A_PARTICIPANT)],
        (req, res, next) => {
            participantController.getParticipantEventsByUserId(req, res, next);
        });

    router.get('/event/:event_id([0-9]+)', [authMiddleware, validate(participantValidation.getParticipantByEvent),
            loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_ALL_PARTICIPANTS)],
        (req, res, next) => {
        participantController.getParticipantsByEventId(req, res, next);
    });



    return router;
};