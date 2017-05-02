'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

class EventController {
    /**
     *
     *@description Event Controller
     *
     *@param  {object} EventService - Event service instance
     *
     */
    constructor(eventService){
        this.eventService = eventService;
    }

    /**
     *@description ENDPOINT  POST /Event/ - creates a new Event
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createEvent (req, res, next) {
        let eventData = req.body;
        this.eventService.createEvent(eventData)
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
     *@description ENDPOINT  GET /Event/ - Retrieves the list of all Events
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAll (req, res, next ) {
        this.eventService.getAllEvents().then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));

            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /:/id - get a Event by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getEvent (req, res, next) {
        let id = Number(req.param('id'));
        this.eventService.getEvent(id).then(
            data => {
                console.log(` GET Event => ${data}`);
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });

        next();
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a Event
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateEvent (req, res, next) {
        let id = req.param('id');
        let body = req.body;
        this.eventService.editEvent(id, body).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
        next();
    }



    /**
     *@description ENDPOINT  DELETE /:/id - delete a Event
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteEvent (req, res, next) {
        let id = Number(req.param('id'));
        this.eventService.deleteEvent(id).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
        next();
    }
}

module.exports = EventController;