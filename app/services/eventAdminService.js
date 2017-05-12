'use strict';
/**
 *@description this is class handles all action that can be performed by a eventAdmin
 */
class EventAdminService {

    /**
     *
     *@description EventAdmin Service Constructor
     *
     *@param  {object} eventAdmin - eventAdmin model instance
     *@param {object}  event - event model instance
     *
     */
    constructor (eventAdmin) {
        this.eventAdmin = eventAdmin;
    }

    /**
     *
     *@description Create an eventAdmin
     *
     *@param  {object} eventAdminData - Object containing eventAdmin data
     *
     * @return {object} a newly created organizer object
     */
    createEventAdmin (eventAdminData) {
        return new Promise((resolve, reject)=>{
            this.eventAdmin.forge().save(eventAdminData)
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
     *@description Edit eventAdmin
     *
     * @param {integer}  eventAdminId- Integer identifying an eventAdmin
     * @param  {object} eventAdminData - Object containing new eventAdmin data
     *
     * @return {object} object - A modified Organizer Object / error
     */
    editEventAdmin (eventAdminId, eventAdminData) {
        return new Promise((resolve, reject)=>{
            this.eventAdmin.forge({id : eventAdminId}).save(eventAdminData)
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
     *@description Get  an eventAdmin
     *
     * @param {integer}  eventAdminId - Integer identifying an eventAdmin
     *
     * @return {object} object -  EventAdmin  Object / error {include all events attached to admin}
     */
    getEventAdmin (eventAdminId) {
        return new Promise((resolve, reject)=>{
            this.eventAdmin.forge({id : eventAdminId}).fetch({ withRelated : [ ]})
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
     *@description Get  all eventAdmins
     *
     *
     * @return {object} object -  Object containing all eventAdmins / error
     */
    getAllEventAdmins () {
        return new Promise((resolve, reject)=>{
            this.eventAdmin.forge().fetchAll()
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
     *@description Delete an eventAdmin
     *
     *@param  {integer} eventAdminId - the ID of eventAdmin
     *
     * @return {object} object - an object containing message/error
     */
    deleteEventAdmin (eventAdminId) {
        return new Promise((resolve, reject)=>{
            this.eventAdmin.forge({id : eventAdminId})
                .destroy()
                .then(data => {
                    return {message : "eventAdmin deleted successfully"};
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

}

module.exports = EventAdminService;