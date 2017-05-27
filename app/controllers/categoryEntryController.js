/**
 * Created by barthclem on 4/19/17.
 */
'use strict';
let HttpStatus = require('http-status-codes');
let responseFormatter = require('../lib/responseFormatter');

class CategoryEntryEntryController {
    /**
     *
     *@description CategoryEntry Controller
     *
     *@param  {object} categoryEntryService - CategoryEntry service instance
     *
     */
    constructor(categoryEntryService){
        this.categoryEntryService = categoryEntryService;
    }

    /**
     *@description ENDPOINT  POST /CategoryEntry/ - creates a new CategoryEntry
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createCategoryEntry (req, res, next) {
        let categoryEntryData = req.body;
        this.categoryEntryService.createCategoryEntry(categoryEntryData)
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
     *@description ENDPOINT  GET /CategoryEntry/ - Retrieves the list of all CategoryEntrys
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAllCategoryEntries (req, res, next ) {
        this.categoryEntryService.getAllCategoryEntries().then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /:/id - get a CategoryEntry by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getCategoryEntry (req, res, next) {
        let id = Number(req.params.id);
        this.categoryEntryService.getCategoryEntry(id).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a CategoryEntry
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateCategoryEntry (req, res, next) {
        let id = Number(req.params.id);
        let body = req.body;
        this.categoryEntryService.editCategoryEntry(id, body).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
    }



    /**
     *@description ENDPOINT  DELETE /:/id - delete a CategoryEntry
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteCategoryEntry (req, res, next) {
        let id = Number(req.params.id);
        this.categoryEntryService.deleteCategoryEntry(id).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            });
    }
}

module.exports = CategoryEntryEntryController;