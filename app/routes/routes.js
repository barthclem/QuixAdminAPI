/**
 * Created by aanu.oyeyemi on 01/04/2017.
 */
'use strict';
let express = require('express');
let router = express.Router();
module.exports.route = router;

module.exports.setup = function setUp (serviceLocator) {
    let userService = serviceLocator.get('userService');
    router.route('/').get( (req, res) => {
            userService.getAllUsers().then(
                data => {
                    res.send(data);
                }
            ).catch( error => {
                res.send({status : 'failed'});
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
    });

    return router;
}



