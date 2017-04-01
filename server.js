'use strict';
let Express = require('express');
let app = Express();
let multer = require('multer');
let multerDone = false;
let router = require('./app/routes/routes');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let path = require('path');
let UserService = require('./app/services/userService');
let userService = new UserService();
let EmailService = require('./app/services/emailAuth');
let emailService = new EmailService();
let userController = require('./app/controllers/userController');
let ServiceLocator = require('./app/config/serviceLocator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(Express.static(__dirname + '/public/')); // switch for angular -- comment out to switch angular off
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));

//file upload multer configuration
/*Configure the multer.*/

// app.use(multer({
//     dest: path.join(__dirname, 'public/uploads'),
//     rename: function (fieldname, filename) {
//         return filename+"_"+Date.now();
//     },
//     onFileUploadStart: function (file) {
//         console.log(file.originalname + ' is starting ...')
//     },
//     onFileUploadComplete: function (file) {
//         console.log(file.fieldname + ' uploaded to  ' + file.path)
//         multerDone=true;
//     }
// }));

 //Email Authorisation code part
app.use('/users', router.setup(ServiceLocator));
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})
let server = app.listen(8000, function () {
    let port = server.address().port;
    let host = server.address().address;
    console.log( 'Server started on '+ host + ' on port : '+port);
})