'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

class EventAdminAdminController {
    /**
     *
     *@description EventAdmin Controller
     *
     *@param  {object} eventAdminService - EventAdmin service instance
     *
     */
    constructor(eventAdminService){
        this.eventAdminService = eventAdminService;
    }

    /**
     *@description ENDPOINT  POST /EventAdmin/ - creates a new EventAdmin
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createEventAdmin (req, res, next) {
        let EventAdminData = req.body;
        this.eventAdminService.createEventAdmin(EventAdminData)
            .then(
                data => {
                    return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
                })
            .catch( error => {
                console.log(`POST ERROR => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /EventAdmin/ - Retrieves the list of all EventAdmins
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAllEventAdmin (req, res, next ) {
        this.eventAdminService.getAllEventAdmin().then(
            data => {
                return res.status(HttpStatus.OK)
                    .send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /:/id - get a EventAdmin by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getEventAdmin (req, res, next) {
        let id = Number(req.param('id'));
        this.eventAdminService.getEventAdmin(id).then(
            data => {
                console.log(` GET EventAdmin => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /:/userId - get a EventAdmin by userId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getEventAdminByUserId (req, res, next) {
        let userId = Number(req.params.userId);
        this.eventAdminService.getEventAdminByUserId(userId).then(
            data => {
                console.log(` GET EventAdmin => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /:/eventId - get a EventAdmin by eventId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getEventAdminByEventId (req, res, next) {
        let eventId = Number(req.params.eventId);
        this.eventAdminService.getEventAdminByEventId(eventId).then(
            data => {
                console.log(` GET EventAdmin => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
                console.log(`\n\n Get Event Admin By EventId Error => ${error}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /:/userId - get a EventAdmin by eventId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getAllEventsEventAdminByUserId (req, res, next) {
        let userId = Number(req.params.userId);
        this.eventAdminService.getAllEventsOfEventAdmin(userId)
            .then(
                data => {
                console.log(` GET All  Events of EventAdmin => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a EventAdmin
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateEventAdmin (req, res, next) {
        let id = req.params.id;
        let body = req.body;
        this.eventAdminService.editEventAdmin(id, body).then(
            data => {
                return res.status(HttpStatus.OK)
                    .send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }



    /**
     *@description ENDPOINT  DELETE /:/id - delete a EventAdmin
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteEventAdmin (req, res, next) {
        let id = Number(req.params.id);
        this.eventAdminService.deleteEventAdmin(id).then(
            data => {return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                console.log(`Deleting Event Admin due to this => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
    }
}

module.exports = EventAdminAdminController;