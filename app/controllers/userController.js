/**
 * Created by aanu.oyeyemi on 08/03/2017.
 */
'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

/**
*@description this is class handles all action to be performed on Users
*/
class UserController {

  /**
  *
  *@description User Controller
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
              res.send(responseFormatter(HttpStatus.OK, data));
          }
      ).catch( error => {
          res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
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

}

module.exports = UserController;
