/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');
let multer = require('multer');

let storage = multer.diskStorage({
    destination : (req, file, callback) => { callback(null, './uploads') },
    filename : (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now())}
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
    constructor(userService, emailAuthService){
        this.userService = userService;
        this.emailAuthService = emailAuthService;
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
    createUser (data) {
      let body = req.body;
      this.userService.createUser(body).
      then(
          data => {
              this.emailService.createEmailAuth(data.attributes.email, data.attributes.username);
              return res.send(responseFormatter(HttpStatus.OK, data));
          }
      ).catch( error => {
          console.log(`POST ERROR => ${error}`);
          return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
      })
    };

      /**
      *@description ENDPOINT  POST /login/ - login user
      *
      *@param  {object} req express request object
      *@param {object}  res express response object
      *@param {function} next express routing callback
      *@return {callback}
      */
      login (req, res, next) {
        let data = req.body;
        this.userService.loginUser(data).then( (loginREsult) => {
            loginREsult = loginREsult === undefined ? false : loginREsult;
            let responseObject = { isCorrect : loginREsult};
            return res.send(responseFormatter(HttpStatus.OK, responseObject));
        }).catch ( error => { return res.send({ isCorrect : false});});
        next();
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
        let id = req.param('id');
        this.userService.getUser(id).then(
          data => {
              console.log(` GET USER => ${data}`);
              return res.send(responseFormatter(HttpStatus.OK, data));
          }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
          });

          next();
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
        let username = req.param('username');
        this.userService.getUserByUsername(username).then(
          data => {
              console.log(` GET USER => ${data}`);
              return res.send(responseFormatter(HttpStatus.OK, data));
          }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
          });

          next();
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
        let id = req.param('id');
        let body = req.body;
        this.userService.updateUser(id, body).then(
            data => {
              return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
        next();
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
        let id = req.param('id');
        this.userService.deleteUser(id).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
          return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            }
        )
        next();
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
            return res.send(responseFormatter(HttpStatus.OK, {message : 'file uploaded successfully'}))
        });
        next();
    }

}

module.exports.init = (userService, emailAuthService)=> {
    return new UserController(userService, emailAuthService);
};
