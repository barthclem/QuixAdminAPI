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
     *
     */
    constructor (categoryEntry, event) {
        this.categoryEntry = categoryEntry;
        this.event = event;
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
     * @param {Integer}  categoryEntryId- Integer identifying a CategoryEntry
     * @param  {object} categoryEntryData - Object containing new CategoryEntry data
     *
     * @return {object} object - A modified categoryEntry Object / error
     */
    editcategoryEntry (categoryEntryId, categoryEntryData) {
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
     * @param {Integer}  categoryEntryId- Integer identifying a categoryEntry
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
     *@param  {Integer} CategoryEntryId - the ID of a CategoryEntry
     *
     * @return {object} object - a object containing message/error
     */
    deleteCategoryEntry (categoryEntryId) {
        return new Promise((resolve, reject)=>{
            this.categoryEntry.forge({id : categoryEntryId})
                .destroy()
                .then(data => {
                    return {message : "categoryEntry deleted successfully"};
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }



}

module.exports = CategoryEntryService;