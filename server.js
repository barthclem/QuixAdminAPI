'use strict';
let Express = require('express');
let app = Express();
let redis = require('./app/config/redis');
let router = require('./app/config/router');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let path = require('path');
let ServiceLocator = require('./app/config/serviceLocator');
let responseFormatter = require('./app/lib/responseFormatter');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(Express.static(__dirname + '/public/')); // switch for angular -- comment out to switch angular off
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));
app.use(redis);
 //Set Up the router
 router.setUp(app, ServiceLocator);

 //Send files to be displayed
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});



app.use(function(err, req, res, next){
    console.log(`Internal Server Error Message : ${err.message}`);
    return res.status(400).send(responseFormatter(400, {message : err}));
    //res.status(400).json(err);
});


let server = app.listen(8000, function () {
    let port = server.address().port;
    let host = server.address().address;
    console.log( 'Server started on '+ host + ' on port : '+port);
});
