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
let constants = require('../config/constants').PERMISSIONS.ORGANIZER;
let userGroup = require('../config/constants').DATA_GROUP.ORGANIZER.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let organizerValidation = require('../validation/organizerValidation');

module.exports = (app, serviceLocator) => {
    let authMiddleware = new AuthMiddleware(app);
    let organizerController = serviceLocator.get('organizerController');
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
        [authMiddleware.authenticate(), loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_ORGANIZERS)],
        (req, res, next) => {
            organizerController.listAllOrganizers(req, res, next);
            //next();
        })
        .post ([authMiddleware.authenticate(),  validate(organizerValidation.createOrganizer)],
            (req, res, next)=> {
                organizerController.createOrganizer(req, res, next);
            });

    router.route('/:id([0-9]+)').get(
        [authMiddleware.authenticate(), validate(organizerValidation.getOrganizer), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.GET_AN_ORGANIZER)], (req, res, next) => {
            organizerController.getOrganizer(req, res, next);
        })
        .put([authMiddleware.authenticate(), validate(organizerValidation.updateOrganizer), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_ORGANIZER)], (req, res, next) => {
            organizerController.updateOrganizer(req, res ,next);
        })
        .delete([authMiddleware.authenticate(), validate(organizerValidation.getOrganizer), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_ORGANIZER)], (req, res, next) => {
            organizerController.deleteOrganizer(req, res, next);
        });

    return router;

};