'use strict';
let Express = require('express');
let app = Express();
let multer = require('multer');
let multerDone = false;
let router = Express.Router();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let path = require('path');
let UserService = require('./app/services/userService');
let userService = new UserService();
let EmailService = require('./app/services/emailAuth');
let emailService = new EmailService();
let userController = require('./app/controllers/userController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(Express.static(__dirname + '/public/')); // switch for angular -- comment out to switch angular off
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));
router.route('/')
    .get( (req, res) => {
        userService.getAllUsers().then(
            data => {
                res.send(data);
            }
        ).catch( error => {
            res.send({status : 'failed'})
        });

    })
    .post ( (req, res)=> {
        let body = req.body;
         userService.createUser(body).
            then(
         data => {
             emailService.createEmailAuth(data.attributes.email, data.attributes.username);
             res.send(data)
         }
     ).catch( error => {
         console.log(`POST ERROR => ${error}`);
         res.send({status : 'failed'})
     })

    });

router.post('/login',  (req, res) => {
    let data = req.body;
    userService.loginUser(data).then( (loginREsult) => {
        loginREsult = loginREsult === undefined ? false : loginREsult;
        let responseObject = { isCorrect : loginREsult};
        return res.send(responseObject);
    }).catch ( error => { return res.send({ isCorrect : false});});
})

 router.route('/:id')
     .get((req, res) => {
         let id = req.param('id');
         userService.getUser(id).then(
             data => {
                 console.log(` GET USER => ${data}`);
                 res.send(data);
             }
         ).catch( error => {
             res.send({status : 'failed'})
         })
     })

     .put((req, res) => {
        let id = req.param('id');
        let body = req.body;
        userService.updateUser(id, body).then(
            data => {
                res.send(data);
            }
        ).catch(error => {
            res.send({status : 'failed'});
        })

     })

     .delete ((req, res) => {
       let id = req.param('id');

       userService.deleteUser(id).then(
           data => res.send(data)
       ).catch(
           error => {
               res.send(error);
           }
       )
     })

//get user wi
 router.get('/:username', (req, res) => {
     let username = req.param('username');
     userService.getUserByUsername(username).then(
         data => {res.send(data); }
     ).catch(error => {
         res.send({status : 'failed'});
     })
 });

router.post('/upload', (req, res) => {
    if(multerDone == true) {
        res.send('done');
    }
})

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
app.use('/users', router);
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