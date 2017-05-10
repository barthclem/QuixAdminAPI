/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');
let multer = require('multer');


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
  *@param {object}  EmailAuthService email service instance
  *
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
      then(
          data => {
              this.emailAuthService.createEmailAuth(data.attributes.email, data.attributes.username);
              return res.status(HttpStatus.OK).
              send(responseFormatter(HttpStatus.OK, data));
          }
      ).catch( error => {
          console.log(error);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {message : 'failed to create new user'}));
      });
    }

      /**
      *@description ENDPOINT  POST /login/ - login user
      *
      *@param  {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      userLogin (req, res, next) {
        let data = req.body;
        this.userService.loginUser(data).then( (loginData) => {
            if(loginData) {
                let userData = loginData.attributes;
                let roles = loginData.related('roleUser');
                let sessionData = req.session;
                sessionData.email = userData.email;
                sessionData.userId  = userData.id;
                sessionData.roleData = roles;
                sessionData.role = null; // set this to null because of rbac module
                return res.send(responseFormatter(HttpStatus.OK, { isCorrect : true}));
            }
            return res.send(responseFormatter(HttpStatus.OK, { isCorrect : false}));
        }).catch ( error => { return res.send(responseFormatter(HttpStatus.BAD_REQUEST,{ isCorrect : false}));});
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

}

module.exports = UserController;
