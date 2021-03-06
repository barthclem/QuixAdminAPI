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
let constants = require('../config/constants').PERMISSIONS.PARTICIPANT;
let userGroup = require('../config/constants').DATA_GROUP.PARTICIPANT.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let participantValidation = require('../validation/participantValidation');

module.exports = (app, serviceLocator) => {
    let authMiddleware = new AuthMiddleware(app);
    let participantController = serviceLocator.get('participantController');

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
        [authMiddleware.authenticate(), loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_PARTICIPANTS)],
        (req, res, next) => {
            participantController.listAllParticipants(req, res, next);
            //next();
        })
        .post([authMiddleware.authenticate(),  validate(participantValidation.createParticipant)],
            (req, res, next)=> {
            participantController.createParticipant(req, res, next);
        });

    router.post('/:event_link',  [authMiddleware.authenticate(), validate(participantValidation.createParticipantWithLink),
        loadRoleMiddleWare(userGroup, true)], (req, res, next) => {
        participantController.createParticipantWithLink(req, res, next);
    });

    router.route('/:id').get(
        [authMiddleware.authenticate(), validate(participantValidation.getParticipant), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_A_PARTICIPANT)], (req, res, next) => {
            participantController.getParticipant(req, res, next);
        })
        .put([authMiddleware.authenticate(), validate(participantValidation.updateParticipant), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_A_PARTICIPANT)], (req, res, next) => {
            participantController.updateParticipant(req, res, next);
        })
        .delete([authMiddleware.authenticate(), validate(participantValidation.getParticipant), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_A_PARTICIPANT)], (req, res, next) => {
            participantController.deleteParticipant(req, res, next);
        });

    router.get('/data/:user_id', [authMiddleware.authenticate(), validate(participantValidation.getParticipant),
            loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_A_PARTICIPANT)],
        (req, res, next) => {
            participantController.getParticipantDataByUserId(req, res, next);
        });

    router.get('/events/:user_id', [authMiddleware.authenticate(), validate(participantValidation.getParticipant),
            loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_A_PARTICIPANT)],
        (req, res, next) => {
            participantController.getParticipantEventsByUserId(req, res, next);
        });

    router.get('/event/:event_id', [authMiddleware.authenticate(), validate(participantValidation.getParticipantByEvent),
            loadRoleMiddleWare(userGroup, true), authorizer.wants(constants.VIEW_ALL_PARTICIPANTS)],
        (req, res, next) => {
        participantController.getParticipantsByEventId(req, res, next);
    });

    return router;
};
