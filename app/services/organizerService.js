'use strict';
/**
 *@description this is class handles all action that can be performed by a participant
 */
class OrganizerService {

    /**
     *
     *@description Organizer Service Constructor
     *
     *@param  {object} organizer - organizer model instance
     *@param {object}  event - event model instance
     *
     */
    constructor (organizer, event) {
        this.organizer = organizer;
        this.event = event;
    }

    /**
     *
     *@description Create an organizer of event(s)
     *
     *@param  {object} organizerData - Object containing organizer data
     *
     * @return {object} a newly created organizer object
     */
    createOrganizer (organizerData) {
        return new Promise((resolve, reject)=>{
            this.organizer.forge().save(organizerData)
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
     *@description Edit an organizer
     *
     * @param {Integer}  organizerId- Integer identifying an Organizer
     * @param  {object} organizerData - Object containing new organizer data
     *
     * @return {object} object - A modified Organizer Object / error
     */
    editOrganizer (organizerId, organizerData) {
        return new Promise((resolve, reject)=>{
            this.organizer.forge({id : organizerId}).save(organizerData)
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
     *@description Get  an organizer
     *
     * @param {Integer}  organizerId- Integer identifying an Organizer
     *
     * @return {object} object -  Organizer Object / error
     */
    getOrganizer (organizerId) {
        return new Promise((resolve, reject)=>{
            this.organizer.forge({id : organizerId})
                .fetch({ withRelated : ['event']})
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
     *@description Get  all organizers
     *
     *
     * @return {object} object -  Object containing all organizers / error
     */
    getAllOrganizers () {
        return new Promise((resolve, reject)=>{
            this.organizer.forge().fetchAll()
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
     *@description Delete an organizer
     *
     *@param  {Integer} organizerId - the ID of organizer
     *
     * @return {object} object - an object containing message/error
     */
    deleteOrganizer (organizerId) {
        return new Promise((resolve, reject)=>{
            this.organizer.forge({id : organizerId})
                .destroy()
                .then(data => {
                    return {message : "organizer deleted successfully"};
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }



}

module.exports = OrganizerService;