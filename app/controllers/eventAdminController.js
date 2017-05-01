'use strict';

class EventAdminAdminController {
    /**
     *
     *@description EventAdmin Controller
     *
     *@param  {object} EventAdminService - EventAdmin service instance
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
        then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch( error => {
            console.log(`POST ERROR => ${error}`);
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        })
    };

    /**
     *@description ENDPOINT  GET /EventAdmin/ - Retrieves the list of all EventAdmins
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAll (req, res, next ) {
        this.eventAdminService.getAllEventAdmins().then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));

            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
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
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });

        next();
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
        let id = req.param('id');
        let body = req.body;
        this.eventAdminService.editEventAdmin(id, body).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
        next();
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
        let id = Number(req.param('id'));
        this.eventAdminService.deleteEventAdmin(id).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            }
        )
        next();
    }
}

module.exports = EventAdminAdminController;