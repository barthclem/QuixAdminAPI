'use strict';
let passport = require('passport');
let passportJWT = require('passport-jwt');
let user= require('../models/user');
let jwt = require('jsonwebtoken');
let config = require('../config/config');
let ExtractJWT = passportJWT.ExtractJwt;
let Strategy = passportJWT.Strategy;
let params = {
    secretOrKey: config.security.jwt.jwtSecret,
    jwtFromRequest: ExtractJWT.fromAuthHeader()
};

function AuthenticationMiddleWare(app) {
    let strategy = new Strategy(params, function (payload, done) {
        user.forge({id: payload.id}).fetch()
            .then( data => {
                done(null, data);
            })
            .catch(error => {
                done(error, false);
            });
    });
    passport.use(strategy);
    app.use(passport.initialize());
}
AuthenticationMiddleWare.prototype.login = function (user) {
    return new Promise((resolve, reject) => {
        let token = jwt.sign(user, params.secretOrKey);
        return resolve(token);
    });
};

AuthenticationMiddleWare.prototype.authenticate = function () {
    return passport.authenticate('jwt',{session: false});
  };

module.exports = AuthenticationMiddleWare;