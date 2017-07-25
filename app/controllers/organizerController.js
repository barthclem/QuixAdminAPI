'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

class OrganizerController {
    /**
     *
     *@description Organizer Controller
     *
     *@param  {object} organizerService - organizer service instance
     *
     */
    constructor(organizerService) {
        this.organizerService = organizerService;
    }

    /**
     *@description ENDPOINT  POST /organizer/ - creates a new organizer
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createOrganizer (req, res, next) {
        let organizerData = req.body;
        this.organizerService.createOrganizer(organizerData)
            .then(
                data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
                console.log(`POST ERROR => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
            });
    }

    /**
     *@description ENDPOINT  GET /organizer/ - Retrieves the list of all organizers
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAllOrganizers (req, res, next) {
        this.organizerService.getAllOrganizers().then(
            data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });
    }

    /**
     *@description ENDPOINT  GET /:/id - get a organizer by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getOrganizer (req, res, next) {
        let id = Number(req.params.id);
        this.organizerService.getOrganizer(id).then(
            data => {
                console.log(` GET organizer => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }).catch(error => {
                console.log(`GET Organizer Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
            });
    }

    /**
     * *@description ENDPOINT  GET /:/id - get a organizer by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getOrganizerWithUserId (req, res, next) {
        let userId = Number(req.params.userId);
        this.organizerService.getOrganizerWithUserId(userId).then(
            data => {
                console.log(` GET organizer => ${data}`);
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            }).catch(error => {
                console.log(`GET Organizer Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
            });
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a organizer
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateOrganizer (req, res, next) {
        let id = req.params.id;
        let body = req.body;
        this.organizerService.editOrganizer(id, body).then(
            data => {
                return res.status(HttpStatus.OK).send(responseFormatter(HttpStatus.OK, data));
            })
            .catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
        });
    }


    /**
     *@description ENDPOINT  DELETE /:/id - delete a organizer
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteOrganizer (req, res, next) {
        let id = Number(req.params.id);
        this.organizerService.deleteOrganizer(id).then(
            data => {return res.status(HttpStatus.OK)
                .send(responseFormatter(HttpStatus.OK, data));})
            .catch(error => {
                console.log(`Delete Organizer Error => ${error}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, { status: 'failed' }));
            });
    }
}

module.exports = OrganizerController;
