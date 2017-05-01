/**
 * Created by barthclem on 4/25/17.
 */
'use strict';
let express = require('express');
let router = require('./routes');
let validate = require('express-validation');
let responseFormatter = require('../lib/responseFormatter');
let authMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../config/authorizator');
let constants = require('../config/constants');

module.exports = (serviceLocator) => {
  let categoryController = serviceLocator.get('categoryController');

  router.route('/').get(
        [authMiddleware, authorizer.wants(constants.GET_ALL_USERS)],
        (req, res, next) => {
            console.log("get request for all");
            userController.listAll(req, res, next);
            next();
        })
};