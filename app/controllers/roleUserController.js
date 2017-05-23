/**
 * Created by barthclem on 4/23/17.
 */

'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

class RoleUserController {

    /**
     *
     *@description RoleUser Controller
     *
     *@param  {object} roleUserService - RoleUser service instance
     *
     */
    constructor(roleUserService){
        this.roleUserService = roleUserService;
    }

    /**
     *@description ENDPOINT  POST /RoleUser/ - creates a new RoleUser
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createRoleUser (req, res, next) {
        let roleUserData = req.body;
        this.roleUserService.createRoleUser(roleUserData)
            .then(
                data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            })
            .catch( error => {
                console.log(`POST ERROR => ${error}`);
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /RoleUser/ - Retrieves the list of all RoleUsers
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listRoleUsers (req, res, next ) {
        this.roleUserService.getAllRoleUsers().then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));

            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /RoleUser/ - Retrieves the list of all RoleUsers
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listRoles (req, res, next ) {
        this.roleUserService.getAllRoles().then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));

            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /:/roleUserId - get a RoleUser by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getRoleUser (req, res, next) {
        let roleUserId = Number(req.params.id);
        this.roleUserService.getRoleUser(roleUserId).then(
            data => {
                console.log(` GET RoleUser => ${data}`);
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
                console.log(`GET RoleUser Error => ${error}`);
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });

    }

    /**
     *@description ENDPOINT  GET /:/userId - get a RoleUser by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getRoleUserByUserId (req, res, next) {
        let userId = Number(req.params.user_id);
        this.roleUserService.getRoleUserByUserId(userId).then(
            data => {
                console.log(` GET RoleUser => ${data}`);
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });

        next();
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a RoleUser
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateRoleUser (req, res, next) {
        let id = Number(req.params.id);
        let body = req.body;
        this.roleUserService.updateRoleUser(id, body).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }



    /**
     *@description ENDPOINT  DELETE /:/roleUserId - delete a RoleUser
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteRoleUser (req, res, next) {
        let roleUserServiceId = Number(req.params.id);
        this.roleUserService.deleteRoleUser(roleUserServiceId).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
        next();
    }

    /**
     *@description ENDPOINT  DELETE /:/userId - delete a RoleUser using userId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteRoleUserWithId (req, res, next) {
        let userId = Number(req.params.user_id);
        this.roleUserService.deleteRoleUserWithId(userId).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
        next();
    }
}

module.exports = RoleUserController;