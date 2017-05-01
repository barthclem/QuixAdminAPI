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

};