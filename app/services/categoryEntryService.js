/**
 * Created by barthclem on 4/22/17.
 */
'use strict';
/**
 *@description this is class handles all action that can be performed on a Event CategoryEntry
 */
class CategoryEntryService {

    /**
     *
     *@description CategoryEntry Service constructor
     *
     *@param  {object} categoryEntry - categoryEntry model instance
     *@param {object}  event - event model instance
     *@param {object} rbacService - rbacService instance
     *
     */
    constructor (categoryEntry, event, rbacService) {
        this.categoryEntry = categoryEntry;
        this.event = event;
        this.rbacService = rbacService;
    }

    /**
     *
     *@description create a CategoryEntry of event
     *
     *@param  {object} categoryEntryData - Object containing CategoryEntry data
     *
     * @return {object} a newly created CategoryEntry object
     */
    createCategoryEntry (categoryEntryData) {
        return new Promise((resolve, reject)=>{
            this.categoryEntry.forge().save(categoryEntryData)
                .then( data => {
                    this.rbacService.createNewCategoryEntry(categoryEntryData.category_id, data.id);
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description Edit a categoryEntry
     *
     * @param {integer}  categoryEntryId - Integer identifying a CategoryEntry
     * @param  {object} categoryEntryData - Object containing new CategoryEntry data
     *
     * @return {object} object - A modified categoryEntry Object / error
     */
    editCategoryEntry (categoryEntryId, categoryEntryData) {
        return new Promise((resolve, reject)=>{
            this.categoryEntry.forge({id : categoryEntryId}).save(categoryEntryData)
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description Get  a categoryEntry
     *
     * @param {integer}  categoryEntryId - Integer identifying a categoryEntry
     *
     * @return {object} object -  categoryEntry Object / error
     */
    getCategoryEntry (categoryEntryId) {
        return new Promise((resolve, reject)=>{
            this.categoryEntry.forge({id : categoryEntryId}).fetch()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description Get  all CategoryEntries
     *
     *
     * @return {object} object -  Object containing all CategoryEntries / error
     */
    getAllCategoryEntries () {
        return new Promise((resolve, reject)=>{
            this.categoryEntry.forge().fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }


    /**
     *
     *@description Delete a CategoryEntry
     *
     *@param  {integer} categoryEntryId - the ID of a CategoryEntry
     *
     * @return {object} object - a object containing message/error
     */
    deleteCategoryEntry (categoryEntryId) {
        return new Promise((resolve, reject)=>{
            this.categoryEntry.forge({id : categoryEntryId})
                .destroy()
                .then(data => {
                    this.rbacService.removeCategoryEntry(categoryEntryId);
                    return resolve({message : "categoryEntry deleted successfully"});
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }



}

module.exports = CategoryEntryService;