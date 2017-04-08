/**
 * Created by aanu.oyeyemi on 01/04/2017.
 */
'use strict';
let express = require('express');
let router = express.Router();
let validate = require('express-validation');
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

let authMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../lib/rbac/roleBase');

module.exports.route = router;

module.exports.setup = function setUp (serviceLocator) {
    let userService = serviceLocator.get('userService');
    router.route('/').get( [authMiddleware, authorizer.wants('viewFrontPage')], (req, res) => {
            userService.getAllUsers().then(
                data => {
                    res.send(responseFormatter(HttpStatus.OK, data));
                }
            ).catch( error => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, data));
            });

        })
        .post (  validate(require('../validation/login')), (req, res)=> {
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

    router.post('/login',  validate(require('../validation/login')), (req, res) => {
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

    // Route to upload file
    router.post('/upload', (req, res) => {
        if(multerDone == true) {
            res.send('done');
        }
    });

    return router;
}
