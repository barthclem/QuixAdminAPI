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
            BookShelf.transaction((transaction) => {
                this.participant.forge().save(participantData, {transacting : transaction})
                    .tap((participant) => {
                       let roleUser = {
                           user_id: participant.attributes.user_id,
                           role_title : constants.ROLES.PARTICIPANT,
                           itemId : participant.attributes.id,
                           data_group_id: constants.DATA_GROUP.PARTICIPANT.id
                       };
                      this.roleUserService.createRoleUserTransaction(roleUser, transaction)
                          .then(data => {
                              participant.event().attach(participant.attributes.event_id,participant.id)
                                  .then((relation) => {
                                      transaction.commit(participant);
                              })
                                  .catch(error => {
                                     throw error;
                                  });
                          })
                          .catch(error => {
                              transaction.rollback(error);
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
     *@param {Number}  participantId - Number containing user identification
     * @return {object} a newly created participant object
     */
    editParticipant (participantId, participantData) {
         return new Promise((resolve, reject)=>{
             this.participant.forge({id : participantId}).save(participantData)
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
     *@param {Number}  id - participant Id
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
     * @description this function get all participants registered for a particular event
     * @param eventId
     * @return {Promise}
     */
    getAllParticipantsByEventId (eventId) {
        return new Promise((resolve, reject) => {
         this.participant.forge()
             .query(qb => {
                 qb.where('event_id', '=', eventId);
             })
             .fetchAll({withRelated : ['event']})
             .then(participantData => {
                 return resolve(participantData);
             })
             .catch(error => {
                 return reject(error);
             })
        });
    }
    /**
     *
     *@description Delete a participant - unregister a participant
     *
     *@param  {Number} userId - the ID of user
     *@param {Number}  participantId - the ID of Participant
     * @return {object} object - an object containing message/error
     */
    deleteParticipant (userId, participantId) {
        return new Promise((resolve, reject)=>{
            BookShelf.transaction(transaction => {
               this.getParticipant(participantId)
                   .then(participant => {
                       participant.event().detach([participant.attributes.event_id, participant.id],
                           {transacting: transaction})
                           .then(()=> {
                            this.participant.forge({id: participantId, userId: userId})
                                .destroy({transacting: transaction})
                                .then(() => {
                                    let dataGroupId = constants.DATA_GROUP.PARTICIPANT.id;
                                    this.roleUserService.deleteRoleUserAtUser(userId, participantId, dataGroupId,
                                        transaction).then(()=> {
                                        transaction.commit();
                                        console.log(`participant deleted successfully`);
                                        return resolve({message : "deleted successfully"});
                                    })
                                })
                                .catch(error => {
                                    console.log(`User Transaction Error => ${error}`);
                                    throw error;
                                })
                           })
                           .catch(error => {
                               throw error;
                           })
                   })
                   .catch(error => {
                       transaction.rollback();
                       console.log("error deleting participant => ${JSON.stringify(error)}");
                       return reject(error);
                   });
            });
        });
    }

    /**
     *
     *@description Get Events For a User
     *
     *@param  {Number} userId - the ID of user
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
     *@param  {Number} userId - the ID of user
     * @return {object} object - an object containing all events for a participant/error
     */
    allParticipantEvents (userId)   {
        return new Promise((resolve, reject)=>{
            this.participant.forge({user_id : userId})
                .fetchAll({ withRelated : [{ 'event': (qb) => {
                 qb.columns('title', 'link', 'scheduled_at', 'organizer_id');
                }}]})
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