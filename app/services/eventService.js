'use strict';
/**
 *@description this is class handles all action that can be carried on an event
 */
let BookShelf = require('../bookshelf');
let constants = require('../config/constants');
let moment = require('moment');
class EventService {

    /**
     *@description Event Service Constructor
     *@param  {object} event - event model instance
     *@param  {object} roleService - an instance of roleService
     *@param  {integer} rbacService - an instance of rbacService
     */
    constructor (event, roleService, rbacService) {
        this.event = event;
        this.roleService = roleService;
        this.rbacService = rbacService;
    }

    /**
     *
     * @description Create an event
     *
     * @param  {object} eventData - Object containing event data
     * @return {object} a newly created organizer object
     */
    createEvent (eventData) {
        return new Promise((resolve, reject)=> {
            let userId = eventData.userId;
            delete eventData.userId;
            BookShelf.transaction((transaction) => {
                this.event.forge().save(eventData, { transacting: transaction })
                    .tap((event) => {
                        let roleUser = {
                            user_id: userId,
                            role_title: constants.ROLES.ORGANIZER,
                            itemId: event.id,
                            data_group_id: constants.DATA_GROUP.EVENT.id
                        };
                        this.roleService.createRoleUserTransaction(roleUser, transaction)
                            .then(roleData => {
                                transaction.commit(event);
                                return resolve(event);
                            })
                            .catch(error => {
                                return error;
                            });
                    })
                    .then(data => {
                        this.rbacService.createNewEvent(data.id);
                        console.log(`Event Service Created =>${data}`);
                    })
                    .catch(error => {
                        console.log(`Event Service Created Error =>${error}`);
                        return reject(error);
                    });
            });
        });
    }

    /**
     *
     * @description Edit event
     *
     * @param {Number}  eventId - Number identifying an event
     * @param  {object} eventData - Object containing new event data
     *
     * @return {object} object - A modified Organizer Object / error
     */
    editEvent (eventId, eventData) {
        return new Promise((resolve, reject)=> {
            this.event.forge({ id: eventId }).save(eventData)
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
     * @description Get  an event
     *
     * @param {Number}  eventId - Number identifying an event
     *
     * @return {object} object -  Event  Object / error
     */
    getEvent (eventId) {
        return new Promise((resolve, reject)=> {
            this.event.forge({ id: eventId }).fetch({ withRelated: ['organizer', 'category'] })
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
     * @description Get  an event
     *
     * @param {string}  eventLink - The link of a registered event
     *
     * @return {object} object -  Event  Object / error
     */
    getEventWithLink (eventLink) {
        return new Promise((resolve, reject)=> {
            this.event.forge({ link: eventLink }).fetch()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     * @description Get  all events
     *
     * @return {object} object -  Object containing all events / error
     */
    getAllEvents () {
        return new Promise((resolve, reject)=> {
            this.event.forge().fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
        * @description Get  all events
        *
        * @return {object} object -  Object containing all events / error
        */
    getAllEventMailData (id) {
        return new Promise((resolve, reject)=> {
            let emailData = {};
            this.event.forge({ id })
                .fetch({ withRelated: ['organizer', 'participant', 'eventAdmin'] })
                .then(data => {
                    //console.log(`Real Event => ${JSON.stringify(data)}`);
                    let organizerMailsPromise = new Promise((resolve, reject) => {
                        data.related('organizer').fetch({ withRelated: ['user'] })
                            .then(organizerModel => {
                                let user = organizerModel.related('user');
                                emailData.organizer =  user.attributes.email;
                                return resolve(emailData);
                            })
                            .catch(error => {
                                console.log(`Organizer Model Error => ${error}`);
                                return reject(error);
                            });
                    });
                    let participantMailPromise = new Promise((resolve, reject) => {
                        let participantMails = [];
                        data.related('participant').fetch({ withRelated: ['user'] })
                            .then(participantModels => {
                                participantModels.each(
                                    participantModel => {
                                        let user = participantModel.related('user');
                                        participantMails.push({ name: user.attributes.name,
                                            email: user.attributes.email });
                                    });
                                emailData.participant = participantMails;
                                return resolve(emailData);
                            })
                            .catch(error => {
                                console.log(`ParticipantModel error => ${error}`);
                                return reject(error);
                            });
                    });
                    let eventAdminMailPromise = new Promise((resolve, reject) => {
                        let eventAdminMails = [];
                        data.related('eventAdmin').fetch({ withRelated: ['user'] })
                            .then(eventAdmins => {
                                eventAdmins.each(
                                    eventAdminModel => {
                                        let user = eventAdminModel.related('user');
                                        eventAdminMails.push(user.attributes.email);
                                    });
                                emailData.eventAdmin = eventAdminMails;
                                return resolve(emailData);
                            })
                            .catch(error => {
                                return reject(error);
                            });
                    });
                    this.getAllEventMailParams().then(data => {
                        console.log(`Scheduled Event Data => ${JSON.stringify(data)}`);
                    }).
                        catch(error => {
                        console.log(`Get Scheduled Event Error => ${error}`);
                    });
                    Promise.all([organizerMailsPromise, participantMailPromise, eventAdminMailPromise])
                        .then(emailData => {
                            return resolve(emailData[2]);
                        })
                        .catch(error => {
                            console.log(`Event Mails Error => ${error}`);
                            return reject(error);
                        });
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     * @description Get  all events
     *@param {Number} organizerId - the id of organizer
     * @return {object} object -  Object containing all events / error
     */
    getAllEventsByOrganizer (organizerId) {
        return new Promise((resolve, reject)=> {
            this.event.forge({ organizerId: organizerId }).fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     * @description Get  all events scheduled today and later
     *
     * @return {object} object -  Object containing all events / error
     */
    getAllEventMailParams () {
        return new Promise((resolve, reject)=> {
            let currentDate = moment().format('YYYY-MM-DD:HH:mm:ss');
            this.event
                .query(qb => {
                    qb.whereRaw('scheduled_at >= ?', [currentDate]);})
                .fetchAll({ columns: ['id', 'scheduled_at', 'title', 'link'] })
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }


    /**
     * @description Delete an event
     *
     * @param  {Number} eventId - the ID of event
     * @param  {Number} userId - the ID of event
     * @return {object} object - an object containing message/error
     */
    deleteEvent (eventId, userId) {
        return new Promise((resolve, reject)=> {
            BookShelf.transaction((transaction) => {
                this.event.forge({ id: eventId })
                    .destroy({ transacting: transaction })
                    .then(() => {
                        let userId = userId;
                        let itemId = eventId;
                        let dataGroupId = constants.DATA_GROUP.EVENT.id;
                        this.roleService.deleteRoleUserAtUser(userId, itemId, dataGroupId, transaction)
                            .then(() => {
                                transaction.commit();
                                console.log(`"event deleted successfully" `);
                                this.rbacService.removeEvent(eventId);

                                return resolve({ message: 'event deleted successfully' });
                            });
                    })
                    .catch(error => {
                        return reject(error);
                    });
            });
        });
    }

}

module.exports = EventService;
