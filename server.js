'use strict';
let Express = require('express');
let app = Express();
let redis = require('./app/config/redis');
let router = require('./app/routes/routes');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let path = require('path');
let ServiceLocator = require('./app/config/serviceLocator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(Express.static(__dirname + '/public/')); // switch for angular -- comment out to switch angular off
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));


 //Email Authorisation code part
app.use('/users', router.setup(ServiceLocator));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.use(redis);

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(function(err, req, res, next){
    console.log(JSON.stringify(err));
    res.status(400).json(err);
});


let server = app.listen(8000, function () {
    let port = server.address().port;
    let host = server.address().address;
    console.log( 'Server started on '+ host + ' on port : '+port);
})
