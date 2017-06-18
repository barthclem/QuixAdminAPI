/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');
let tokenGenerator = require('../lib/simpleLinkGenerator');
let multer = require('multer');
let constant = require('../config/constants').UTILITY;

let storage = multer.diskStorage({
    destination : (req, file, callback) => { callback(null, './uploads'); },
    filename : (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now());}
});

let upload = multer({ storage : storage}).single('upload');


/**
*@description this is class handles all action to be performed on Users
*/
class UserController {

  /**
  *
  *@description User Controller
  *
  *@param  {object} userService - user service instance
  *@param {object}  emailAuthService email service instance
  *@param {object}  roleUserService roleUser service instance
  */
    constructor(userService, emailAuthService, roleUserService){
        this.userService = userService;
        this.emailAuthService = emailAuthService;
        this.roleUserService = roleUserService;
    }

    /**
    *@description ENDPOINT  GET /user/ - Retrieves the list of all Users
    *
    *@param  {object} req express request object
    *@param {object}  res express response object
    *@param {function} next express routing callback
    *@return {callback}
    */
    listAll (req, res, next ) {
      this.userService.getAllUsers().then(
          data => {
              return res.send(responseFormatter(HttpStatus.OK, data));
          }
      ).catch( error => {
          return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
      });

    }

    /**
    *@description ENDPOINT  POST /user/ - creates a new user
    *
    *@param  {object} req express request object
    *@param {object}  res express response object
    *@param {function} next express routing callback
    *@return {callback}
    */
    createUser (req, res, next) {
      let body = req.body;
      this.userService.createUser(body).
      then(data => {
              this.emailAuthService.createEmailAuth(data.attributes.email)
                  .then(() => {
                  let message = 'click on the link sent to your email to verify it';
                      return res.status(HttpStatus.OK).
                      send(responseFormatter(HttpStatus.OK, {message}));
                  });
          }
      ).catch( error => {
          console.log(error);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {message : 'failed to create new user'}));
      });
    }

      /**
      *@description ENDPOINT  POST /login/ - login user
      *@param {function} authMiddleware a function that makes jwt authentication for the login system
      *@param {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      userLogin (authMiddleware, req, res, next) {
        let data = req.body;
        this.userService.loginUser(data).then( (loginData) => {
            if(loginData) {
                let userData = loginData.attributes;
                if(userData.status === constant.UNVERIFIED){
                    this.emailAuthService.createEmailAuth(data.attributes.email)
                        .then(() => {
                            return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, {
                                message: 'your email has been not verified, please click the link sent to your mail'
                            }));
                        })
                        .catch(error => {
                            console.log(`Email Verification error is => ${error}`);
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {
                                    message : 'pleaser try again later as our system is experiencing a failure'
                                }))
                        })
                }
                let roles = loginData.related('roleUser');
                let sessionData = req.session;
                sessionData.email = userData.email;
                sessionData.userId  = userData.id;
                sessionData.roleData = roles;
                sessionData.role = null; // set this to null because of rbac module
                let user = Object.assign({}, {id : loginData.id, permission: sessionData});
                authMiddleware.login(user).then(token => {
                    return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, { token : token}));
                })
                    .catch(error => {
                        console.log(`AuthMiddleWare Token Gen Error => ${error}`)
                    });
            }
            else{
                return res.send(responseFormatter(HttpStatus.OK, { isCorrect : false}));
            }
        }).catch ( error => {
            console.log(`Login Error is => ${error}`);
            return res.status(HttpStatus.BAD_REQUEST)
            .send(responseFormatter(HttpStatus.BAD_REQUEST,{ isCorrect : false}));});
      }

      /**
      *@description ENDPOINT  GET /:/id - get a user by id
      *
      *@param  {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      getUser (req, res, next) {
        let id = req.params.id;
        this.userService.getUser(id).then(
          data => {
              return res.status(HttpStatus.OK)
              .send(responseFormatter(HttpStatus.OK, data ? data : {}));

          }).catch( error => {
              console.log(`GET USER Error => ${error}`);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR,
                    {message : `failed to get a user with id ${id}`})).end();
          });

      }

      /**
      *@description ENDPOINT  GET /:/username - get a user by username
      *
      *@param  {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      getUserByUsername (req, res, next) {
        let username = req.params.username;
        this.userService.getUserByUsername(username).then(
          data => {
              console.log(` GET USER => ${data}`);
              return res.status(HttpStatus.OK)
                  .send(responseFormatter(HttpStatus.OK, data ? data : {}));
          }).catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR,
                    {message : 'failed to a user with username ${username}'}));
          });

          //next();
      }

      /**
      *@description ENDPOINT  PUT /:/id - update a user
      *
      *@param  {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      updateUser (req, res, next) {
        let id = req.params.id;
        let body = req.body;
        this.userService.updateUser(id, body).then(
            data => {
              return res.status(HttpStatus.OK)
                  .send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            console.log(`UPDATE ERROR => ${error}`);
            return res.status(HttpStatus.BAD_REQUEST)
                .send(responseFormatter(HttpStatus.BAD_REQUEST,
                    {message : 'failed to update a user with a id ${id}'}));
        });

      }

      /**
      *@description ENDPOINT  DELETE /:/id - delete a user
      *
      *@param  {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      deleteUser (req, res, next) {
        let id = req.params.id;
        this.userService.deleteUser(id).then(
            () => {
                return res.status(HttpStatus.OK)
                    .send(responseFormatter(HttpStatus.OK,
                        {message : `deleted a user with id ${id}`}));})
            .catch(error => {
                return res.status(HttpStatus.BAD_REQUEST)
                    .send(responseFormatter(HttpStatus.BAD_REQUEST,
                        {message : `failed to delete a user with id ${id}`}));
            });

      }

    /**
     * @description Handles File Upload
     *
     * @param {object}  res express response object
     * @param {object}  req express request object
     * @param {function} next callback function
     *
     * @return {callback}
     */

    uploadPic (req, res, next) {
        upload(req, res, function (err) {
            if(err){
                return res.send(responseFormatter(HttpStatus.UNSUPPORTED_MEDIA_TYPE, {status : 'failed'}));
            }
            return res.send(responseFormatter(HttpStatus.OK, {message : 'file uploaded successfully'}));
        });
        next();
    }

    /**
     *@description ENDPOINT  GET /user/verify - verify the email of a user
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    verifyUserEmail (req, res, next) {
        let authenticationToken = req.params.token;
        this.emailAuthService.verifyUserEmail(authenticationToken)
            .then( message => {
                if(message === constant.VERIFIED) {
                    return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, {
                        message: 'your email has been verified, you can login'
                    }));
                }

                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, {
                    message: 'your email has been not verified as this link is expired, another link has been sent'
                }));
            })
        .catch( error => {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {message : 'failed to verify email'}));
        });
    }

}

module.exports = UserController;
