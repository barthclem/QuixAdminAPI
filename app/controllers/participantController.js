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
                    return res.send(responseFormatter(HttpStatus.OK, data));
            })
            .catch( error => {
                console.log(`POST ERROR => ${error}`);
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
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
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
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
        let id = Number(req.param.id);
        this.participantService.getParticipant(id).then(
            data => {
                console.log(` GET Participant => ${data}`);
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });

        next();
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
        let id = req.param('id');
        let body = req.body;
        this.participantService.editParticipant(id, body).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
        next();
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
        let userId = Number(req.param.user_id);
        this.participantService.allUserEventsData(userId).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
        next();
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
        let userId = Number(req.param.user_id);
        this.participantService.allParticipantEvents(userId).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
        next();
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
        let id = Number(req.param.id);
        this.participantService.deleteParticipant(id).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
        next();
    }
}

module.exports = ParticipantController;