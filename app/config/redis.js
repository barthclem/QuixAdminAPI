/**
 * Created by aanu.oyeyemi on 08/04/2017.
 */
/**
 * @description REDIS CONFIG
 */

let session = require('express-session');
let redis = require('redis');
let redisStore = require('connect-redis')(session);
let client = redis.createClient();
let config = require('./config');

module.exports =  (()=> {
    return session({secret: config.database.redis.redis_secret,
        store : new redisStore({ host: config.database.redis.redis_host,
            port : config.database.redis.redis_port,
            client : client, ttl:260}),
        cookie : { maxAge:config.session.cookie.duration, secure : false},
        resave:false, saveUninitialized : true})
})();