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
        let token = jwt.sign(user, params.secretOrKey, {expiresIn: '14400m'});
        return resolve(token);
    });
};

AuthenticationMiddleWare.prototype.authenticate = function () {
    return function (req, res, next){
        return passport.authenticate('jwt',{session: false}, function(err, user, info){
            if (err) { return next(err); }
            let headers = req.headers;
            if (headers && headers.authorization) {
                let parted = headers.authorization.split(' ');
                if (parted.length === 2) {
                    let decoded=jwt.decode(parted[1], config.security.jwt.jwtSecret);
                    let sessionData = req.session;
                    sessionData.email = decoded.permission.email;
                    sessionData.userId  = decoded.permission.userId;
                    sessionData.roleData = decoded.permission.roleData;
                } else {
                    console.log(`Authorization token is => nothing`);
                }
            } else {
                console.log(`Authorization token is => nothing`);
            }
            next();
        })(req, res, next);
    }
  };

module.exports = AuthenticationMiddleWare;