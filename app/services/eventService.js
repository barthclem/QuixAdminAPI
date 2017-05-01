'use strict';
/**
 *@description this is class handles all action that can be carried on an event
 */
class EventService {

    /**
     *
     *@description Event Service Constructor
     *
     *@param  {object} event - event model instance
     *@param {object}  event - event model instance
     *
     */
    constructor (event) {
        this.event = event;
    }


    /**
     *
     *@description Create an event
     *
     *@param  {object} eventData - Object containing event data
     *
     * @return {object} a newly created organizer object
     */
    createEvent (eventData) {
        this.event.forge().save(eventData)
            .then( data => {
                return data;
            })
            .catch(error => {
                throw error;
            })
    }

    /**
     *
     *@description Edit event
     *
     * @param {Integer}  eventId- Integer identifying an event
     * @param  {object} eventData - Object containing new event data
     *
     * @return {object} object - A modified Organizer Object / error
     */
    editEvent (eventId, eventData) {
        this.event.forge({id : eventId}).save(eventData)
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get  an event
     *
     * @param {Integer}  eventId - Integer identifying an event
     *
     * @return {object} object -  Event  Object / error
     */
    getEvent (eventId) {
        this.event.forge({id : eventId}).fetch({ withRelated : ['organizer', 'event', 'category']})
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get  all events
     *
     *
     * @return {object} object -  Object containing all events / error
     */
    getAllEvents () {
        this.event.forge().fetchAll()
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }


    /**
     *
     *@description Delete an event
     *
     *@param  {Integer} eventId - the ID of event
     *
     * @return {object} object - an object containing message/error
     */
    deleteEvent (eventId) {
        this.event.forge({id : eventId})
            .destroy()
            .then(data => {
                return {message : "event deleted successfully"};
            })
            .catch(error => {
                throw error;
            });
    }

}

module.exports = EventService;