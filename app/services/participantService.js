'use strict';
/**
 *@description this is class handles all action that can be performed by a participant
 */
class ParticipantService {

    /**
     *
     *@description Participant Service Constructor
     *
     *@param  {object} participant - participant model instance
     *@param {object}  event - event model instance
     *
     */
    constructor (participant ,event) {
        this.participant = participant;
        this.event = event;
    }

    /**
     *
     *@description Create a participant for an event
     *
     *@param  {object} participantData - Object containing userId and ParticipantId
     *
     * @return {object} a newly created participant object
     */
    createParticipant (participantData) {
        this.participant.forge().save(participantData)
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

     /**
     *
     *@description Edit a Participant
     *
     *@param  {object} participantData - Object containing userId, ParticipantId and score
     *@param {Integer}  userId - Integer containing user identification
     * @return {object} a newly created participant object
     */
    editParticipant (userId, participantData) {
        this.participant.forge({userId : userId}).save(participantData)
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get a Participant
     *
     *@param {Integer}  id - participant Id
     * @return {object} participant - a participant object
     */
    getParticipant (id) {
        this.participant.forge({id: id}).fetch()
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get all Participants
     *
     * @return {object} participant - get all participants object
     */
    getAllParticipants () {
        this.participant.forge().fetchAll()
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Delete a participant - unregister a participant
     *
     *@param  {Integer} userId - the ID of user
     *@param {Integer}  eventId - the ID of eventId
     * @return {object} object - an object containing message/error
     */
    deleteParticipant (userId, eventId) {
        this.participant.forge({userId : userId})
            .query( qb=> {
                qb.where('eventId', '=', eventId);
            })
            .destroy()
            .then(data => {
                return {message : "deleted successfully"};
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get Events For a User
     *
     *@param  {Integer} userId - the ID of user
     * @return {object} object - an object containing all events for a user/error
     */
    allUserEventsData (userId) {
        this.participant.forge({userId : userId})
            .fetchAll()
            .then(data => {
                return data;
            })
            .catch(error => {
                throw  error;
            });
    }


    /**
     *
     *@description Get All Events for a Participant
     *
     *@param  {Integer} userId - the ID of user
     * @return {object} object - an object containing all events for a participant/error
     */
    allParticipantEvents (userId) {
        this.participant.forge()
            .query( qb=> {
                qb.innerJoin('events', 'participant.event_id', 'event.id');
                qb.where('participant.user_id', '=', userId);
            })
            .fetchAll()
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }


}

module.exports = ParticipantService;