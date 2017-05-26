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
let userGroup = require('../config/constants').DATA_GROUP.CATEGORY.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let categoryValidation = require('../validation/categoryValidation');

module.exports = (serviceLocator) => {
  let categoryController = serviceLocator.get('categoryController');

    router.route('/').get(
        [authMiddleware, loadRoleMiddleWare(userGroup), authorizer.wants(constants.VIEW_ALL_CATEGORIES)],
        (req, res, next) => {
            categoryController.listAllCategories(req, res, next);
            //next();
        })
        .post ([authMiddleware,  validate(categoryValidation.createCategory), loadRoleMiddleWare(userGroup),
                authorizer.wants(constants.CREATE_A_CATEGORY)],
            (req, res, next)=> {
                categoryController.createCategory(req, res);
            });

    router.route('/:id([0-9]+)').get(
        [authMiddleware, validate(categoryValidation.getCategory), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_A_CATEGORY)], (req, res, next) => {
            categoryController.getCategory(req, res, next);
        })
        .put([authMiddleware, validate(categoryValidation.editCategory), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_A_CATEGORY)], (req, res, next) => {
            categoryController.updateCategory(req, res ,next);
        })
        .delete([authMiddleware, validate(categoryValidation.getCategory), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_A_CATEGORY)], (req, res, next) => {
            categoryController.deleteCategory(req, res, next);
        });

    return router;
};