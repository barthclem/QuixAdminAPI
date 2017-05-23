/**
 * Created by aanu.oyeyemi on 01/04/2017.
 */
'use strict';
let express = require('express');
let router = express.Router();
let responseFormatter = require('../lib/responseFormatter');
let constants = require('../config/constants');

module.exports = (() => {
    router.use(function (req, res, next) {
        console.log("First Middleware");
        // Website you wish to allow to connect
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
      });

    return router;
})();

// module.exports.route = router;