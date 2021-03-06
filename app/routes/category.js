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
let userGroup = require('../config/constants').DATA_GROUP.CATEGORY.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let categoryValidation = require('../validation/categoryValidation');

module.exports = (app, serviceLocator) => {
    let categoryController = serviceLocator.get('categoryController');
    let authMiddleware = new AuthMiddleware(app);

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
            categoryController.listAllCategories(req, res, next);
            //next();
        })
        .post([authMiddleware.authenticate(),  validate(categoryValidation.createCategory), loadRoleMiddleWare(userGroup),
                authorizer.wants(constants.CREATE_A_CATEGORY)],
            (req, res, next)=> {
                categoryController.createCategory(req, res);
            });

    router.route('/:id').get(
        [authMiddleware.authenticate(), validate(categoryValidation.getCategory), loadRoleMiddleWare(userGroup, true),
           authorizer.wants(constants.VIEW_A_CATEGORY)],
        (req, res, next) => {
            categoryController.getCategory(req, res, next);
        })
        .put([authMiddleware.authenticate(), validate(categoryValidation.editCategory), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_A_CATEGORY)], (req, res, next) => {
            categoryController.updateCategory(req, res, next);
        })
        .delete([authMiddleware.authenticate(), validate(categoryValidation.getCategory), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.DELETE_A_CATEGORY)], (req, res, next) => {
            categoryController.deleteCategory(req, res, next);
        });
    return router;
};
