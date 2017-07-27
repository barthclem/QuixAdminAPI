// jscs:disable disallowMultipleLineBreaks
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
     *@param {object}  emailAuthService email service instance
     */
    constructor(eventService, organizerService, emailAuthService) {
        this.eventService = eventService;
        this.organizerService = organizerService;
        this.emailAuthService = emailAuthService;
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
        let _this = this;
        if (eventData.organizer_id) {
            this.organizerService.getOrganizer(eventData.organizer_id)
                .then((async function (organizer) {
                    eventData.userId = organizer.attributes.user_id;
                    eventData.link = await simpleLinkGenerator(eventData.title);
                    let organizerEmail = organizer.related('user').attributes.email;
                    _this.eventService.createEvent(eventData)
                        .then(data => {
                            console.log(`$ event Controller data => ${data}`);
                            _this.emailAuthService.sendNewEventMail(organizerEmail, eventData.title, eventData.link);
                            return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, {
                                message: `Event successfully registered`,
                                eventLink: `/event/register/${eventData.link}`
                            }));
                        })
                        .catch(error => {
                            throw error;
                        });
                }))
                .catch(error => {
                    console.log(`POST ERROR => ${error}`);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
                });
        } else {
            this.organizerService.getOrganizerWithUserId(userId)
                .then(organizer => {
                    eventData.organizer_id = organizer.id;
                    eventData.userId = userId;
                    eventData.link = simpleLinkGenerator(eventData.title);
                    let organizerEmail = organizer.related('user').attributes.email;
                    $.eventService.createEvent(eventData)
                        .then(data => {
                            $.emailAuthService.sendNewEventMail(organizerEmail, eventData.title, eventData.link);
                            return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, {
                                message: `Event successfully registered`,
                                eventLink: `/event/register/${eventData.link}`
                            }));
                        })
                        .catch(error => {
                            throw error;
                        });
                })
                .catch(error => {
                    console.log(`POST ERROR => ${error}`);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
                });
        }// jscs:ignore disallowMultipleLineBreaks
    }


    /**
     *@description ENDPOINT  GET /Event/ - Retrieves the list of all Events
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAllEvents (req, res, next) {
        this.eventService.getAllEvents()
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
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
    listAllEventsByOrganizer (req, res, next) {
        let organizerId = Number(req.params.id);
        this.eventService.getAllEventsByOrganizer(organizerId)
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
                console.log(`Error unable to fetch all events of an organizer => ${JSON.stringify(error)}`);
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
            .catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
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
    getCatEvent (req, res, next) {
        let id = Number(req.params.id);
        this.eventService.getCatEvent(id)
            .then(data => {
                console.log(` GET Event => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
                console.log(` Get Cat Event Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
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
    getAllEventMails (req, res, next) {
        let id = Number(req.params.id);
        this.eventService.getAllEventMailData(id)
            .then(data => {
                console.log(` GET All Event => ${JSON.stringify(data)}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
                console.log(`get All event Mails Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
            });
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
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
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
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
            });
    }
}

module.exports = EventController;
