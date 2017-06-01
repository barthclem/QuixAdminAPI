'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

class ParticipantController {

    /**
     *
     *@description Participant Controller
     *
     *@param  {object} participantService - participant service instance
     *
     */
    constructor(participantService){
        this.participantService = participantService;
    }

    /**
     *@description ENDPOINT  POST /participant/ - creates a new participant
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createParticipant (req, res, next) {
        let participantData = req.body;
        this.participantService.createParticipant(participantData)
            .then(
                data => {
                    return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch( error => {
                console.log(`POST ERROR => ${error}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /participant/ - Retrieves the list of all participants
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAllParticipants (req, res, next ) {
        this.participantService.getAllParticipants().then(
            data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch( error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /:/id - get a participant by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getParticipant (req, res, next) {
        let id = Number(req.params.id);
        this.participantService.getParticipant(id).then(
            data => {
                console.log(` GET Participant => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
                console.log(`Error Message => ${error}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a participant
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateParticipant (req, res, next) {
        let id = Number(req.params.id);
        let body = req.body;
        this.participantService.editParticipant(id, body).then(
            data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            console.log(`Participant Update Error => ${error}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  GET /:/userId - get a participant using userId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getParticipantDataByUserId (req, res, next) {
        let userId = Number(req.params.user_id);
        this.participantService.allUserEventsData(userId).then(
            data => {return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
    }

    /**
     *@description ENDPOINT  GET /:/userId - get a participant list of events using userId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getParticipantEventsByUserId (req, res, next) {
        let userId = Number(req.params.user_id);
        this.participantService.allParticipantEvents(userId).then(
            data => {return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                console.log(`Get Participant Events Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
    }

    /**
     *@description ENDPOINT  GET /:/eventId - get a participant list of events using eventId
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getParticipantsByEventId (req, res, next) {
        let eventId = Number(req.params.event_id);
        this.participantService.getAllParticipantsByEventId(eventId)
            .then(data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR,{status: 'we will soon fix the problem'}));
            })
    }

    /**
     *@description ENDPOINT  DELETE /:/id - delete a participant
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteParticipant (req, res, next) {
        let id = Number(req.params.id);
        let user_id  = req.session.userId;
        console.log(`Started Deleting participant model`);
        this.participantService.deleteParticipant(user_id, id).then(
            data => {
                console.log(`Delete Participant Data => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                console.log(`Delete Participant Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
    }
}

module.exports = ParticipantController;