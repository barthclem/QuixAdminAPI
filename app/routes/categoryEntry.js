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
let constants = require('../config/constants').PERMISSIONS.CATEGORY;
let userGroup = require('../config/constants').DATA_GROUP.CATEGORY_ENTRY.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let categoryEntryValidation = require('../validation/categoryEntryValidation');

module.exports = (serviceLocator) => {
    let categoryEntryController = serviceLocator.get('categoryEntryController');

    router.route('/').get(
        [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_CATEGORIES)],
        (req, res, next) => {
            categoryEntryController.listAllCategoryEntries(req, res, next);
            //next();
        })
        .post ([authMiddleware,  validate(categoryEntryValidation.createCategoryEntry), loadRoleMiddleWare(userGroup),
                authorizer.wants(constants.CREATE_A_CATEGORY)],
            (req, res, next)=> {
                categoryEntryController.createCategoryEntry(req, res);
            });

    router.route('/:id([0-9]+)').get(
        [authMiddleware, validate(categoryEntryValidation.getCategoryEntry), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_A_CATEGORY)], (req, res, next) => {
            categoryEntryController.getCategoryEntry(req, res, next);
        })
        .put([authMiddleware, validate(categoryEntryValidation.editCategoryEntry), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_A_CATEGORY)], (req, res, next) => {
            categoryEntryController.updateCategoryEntry(req, res ,next);
        })
        .delete([authMiddleware, validate(categoryEntryValidation.getCategoryEntry), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_A_CATEGORY)], (req, res, next) => {
            categoryEntryController.deleteCategoryEntry(req, res, next);
        });

    return router;
};