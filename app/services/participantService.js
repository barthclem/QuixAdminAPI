'use strict';
/**
 *@description this is class handles all action that can be performed by a participant
 */
let BookShelf = require('../bookshelf');
let constants = require('../config/constants');
class ParticipantService {

    /**
     *
     *@description Participant Service Constructor
     *@param  {object} roleUserService - roleUserService  instance
     *@param  {object} participant - participant model instance
     *@param {object}  event - event model instance
     *
     */
    constructor (participant ,event, roleUserService) {
        this.participant = participant;
        this.event = event;
        this.roleUserService = roleUserService
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
        return new Promise((resolve, reject)=>{
            BookShelf.transaction((t) => {
                this.participant.forge().save(participantData, {transacting : t})
                    .tap((participant) => {
                       console.log(`Participant here => ${JSON.stringify(participant)}`);
                       let roleUser = {
                           user_id: participant.attributes.user_id,
                           role_title : constants.ROLES.PARTICIPANT,
                           itemId : participant.attributes.id,
                           data_group_id: constants.DATA_GROUP.PARTICIPANT.id
                       };
                      this.roleUserService.createRoleUserTransaction(roleUser, t)
                          .then(data => {
                              console.log(`Saved Role User Transaction => ${JSON.stringify(data)}`);
                          })
                          .catch(error => {
                              console.log(`Saved Role User Transaction Error=> ${JSON.stringify(error)}`);
                              throw error;
                          });
                    })
                    .then(newParticipant => {
                        return resolve(newParticipant);
                    })
                    .catch(error => {
                        return reject(error);
                    });
            });
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
         return new Promise((resolve, reject)=>{
             this.participant.forge({userId : userId}).save(participantData)
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
     *@description Get a Participant
     *
     *@param {Integer}  id - participant Id
     * @return {object} participant - a participant object
     */
    getParticipant (id) {
        return new Promise((resolve, reject)=>{
            this.participant.forge({id: id}).fetch()
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
     *@description Get all Participants
     *
     * @return {object} participant - get all participants object
     */
    getAllParticipants () {
        return new Promise((resolve, reject)=>{
            this.participant.forge().fetchAll()
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
     *@description Delete a participant - unregister a participant
     *
     *@param  {Integer} userId - the ID of user
     *@param {Integer}  eventId - the ID of eventId
     * @return {object} object - an object containing message/error
     */
    deleteParticipant (userId, eventId) {
        return new Promise((resolve, reject)=>{
            this.participant.forge({userId : userId})
                .query( qb=> {
                    qb.where('eventId', '=', eventId);
                })
                .destroy()
                .then(data => {
                    return {message : "deleted successfully"};
                })
                .catch(error => {
                    return reject(error);
                });
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
        return new Promise((resolve, reject)=>{
            this.participant.forge({userId : userId})
                .fetchAll()
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
     *@description Get All Events for a Participant
     *
     *@param  {Integer} userId - the ID of user
     * @return {object} object - an object containing all events for a participant/error
     */
    allParticipantEvents (userId) {
        return new Promise((resolve, reject)=>{
            this.participant.forge()
                .query( qb=> {
                    qb.innerJoin('events', 'participant.event_id', 'event.id');
                    qb.where('participant.user_id', '=', userId);
                })
                .fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }
}

module.exports = ParticipantService;