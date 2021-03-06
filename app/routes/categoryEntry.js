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
let constants = require('../config/constants').PERMISSIONS.CATEGORY;
let userGroup = require('../config/constants').DATA_GROUP.CATEGORY_ENTRY.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let categoryEntryValidation = require('../validation/categoryEntryValidation');

module.exports = (app, serviceLocator) => {
    let authMiddleware = new AuthMiddleware(app);
    let categoryEntryController = serviceLocator.get('categoryEntryController');

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
        [authMiddleware.authenticate(), loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_CATEGORIES)],
        (req, res, next) => {
            categoryEntryController.listAllCategoryEntries(req, res, next);
            //next();
        })
        .post ([authMiddleware.authenticate(),  validate(categoryEntryValidation.createCategoryEntry), loadRoleMiddleWare(userGroup),
                authorizer.wants(constants.CREATE_A_CATEGORY)],
            (req, res, next)=> {
                categoryEntryController.createCategoryEntry(req, res);
            });

    router.route('/:id').get(
        [authMiddleware.authenticate(), validate(categoryEntryValidation.getCategoryEntry), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_A_CATEGORY)], (req, res, next) => {
            categoryEntryController.getCategoryEntry(req, res, next);
        })
        .put([authMiddleware.authenticate(), validate(categoryEntryValidation.editCategoryEntry), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_A_CATEGORY)], (req, res, next) => {
            categoryEntryController.updateCategoryEntry(req, res ,next);
        })
        .delete([authMiddleware.authenticate(), validate(categoryEntryValidation.getCategoryEntry), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_A_CATEGORY)], (req, res, next) => {
            categoryEntryController.deleteCategoryEntry(req, res, next);
        });

    return router;
};