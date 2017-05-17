'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');
let simpleLinkGenerator = require('../lib/simpleLinkGenerator');
class EventController {

    /**
     *@description Event Controller
     *
     *@param  {object} eventService - Event service instance
     *@param  {object} organizerService - An instance of organizer service
     *
     */
    constructor(eventService, organizerService){
        this.eventService = eventService;
        this.organizerService = organizerService;
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
        let userId = req.session.userId;
        this.organizerService.getOrganizerWithUserId(userId)
            .then(organizer => {
                eventData.organizer_id= organizer.id;
                eventData.userId = userId;
                eventData.link = simpleLinkGenerator(eventData.title);
                this.eventService.createEvent(eventData)
                    .then(data => {
                        return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
                    })
                    .catch (error => {
                        throw error;
                    })
            })
            .catch(error => {
                console.log(`POST ERROR => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
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
    listAllEvents (req, res, next ) {
        this.eventService.getAllEvents()
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
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
    listAllEventsByOrganizer (req, res, next ) {
        let organizerId = Number(req.params.organizer_id);
        this.eventService.getAllEventsByOrganizer(organizerId)
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
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
        let id = Number(req.params.id);
        this.eventService.getEvent(id)
            .then(data => {
                console.log(` GET Event => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
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
        let id = Number(req.params.id);
        let body = req.body;
        this.eventService.editEvent(id, body)
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
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
        let id = Number(req.params.id);
        let userId = Number(req.session.userId);
        this.eventService.deleteEvent(id, userId)
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));})
            .catch(error => {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
    }
}

module.exports = EventController;