'use strict';
/**
 *@description this is class handles all action that can be performed by a eventAdmin
 */
let BookShelf = require('../bookshelf');
let constants = require('../config/constants');
class EventAdminService {

    /**
     *@description EventAdmin Service Constructor
     *
     *@param  {object} eventAdmin - eventAdmin model instance
     *@param {object}  roleUserService - roleUser service instance
     *
     */
    constructor (eventAdmin, roleUserService) {
        this.eventAdmin = eventAdmin;
        this.roleUserService = roleUserService;
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
        return new Promise((resolve, reject)=> {
            BookShelf.transaction((transaction) => {
                this.eventAdmin.forge().save(eventAdminData, transaction)
                    .tap((eventAdmin) => {
                        let roleData = {
                            user_id: eventAdmin.attributes.user_id,
                            role_title: constants.ROLES.EVENT_ADMIN,
                            itemId: eventAdmin.attributes.id,
                        };
                        let eventAdminRole = Object.assign({ data_group_id: constants.DATA_GROUP.EVENTADMIN.id }, roleData);
                        let eventRole = Object.assign({ data_group_id: constants.DATA_GROUP.EVENT.id }, roleData);

                        Object.assign(eventRole, roleData);
                        Promise.all([this.roleUserService.createRoleUserTransaction(eventAdminRole, transaction),
                        this.roleUserService.createRoleUserTransaction(eventRole, transaction)])
                            .then(()=> {
                                transaction.commit(eventAdmin);
                                return resolve(eventAdmin);
                            })
                            .catch(error => {
                                console.log(`Event Admin Transaction Failed due to => ${error}`);
                                throw error;
                            });
                    })
                    .then(() => {
                        console.log(`EventAdmin successfully created (-_-)`);
                    })
                    .catch((error) => {
                        return reject(error);
                    });
            });
        });
    }

    /**
     *
     *@description Edit eventAdmin
     *
     * @param {integer}  eventAdminId - Integer identifying an eventAdmin
     * @param  {object} eventAdminData - Object containing new eventAdmin data
     *
     * @return {object} object - A modified Organizer Object / error
     */
    editEventAdmin (eventAdminId, eventAdminData) {
        return new Promise((resolve, reject)=> {
            this.eventAdmin.forge({ id: eventAdminId }).save(eventAdminData)
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
        return new Promise((resolve, reject)=> {
            this.eventAdmin.forge({ id: eventAdminId }).fetch()
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
     * @param {integer}  userId - Integer identifying an eventAdmin
     *
     * @return {object} object -  EventAdmin  Object / error {include all events attached to admin}
     */
    getEventAdminByUserId (userId) {
        return new Promise((resolve, reject)=> {
            this.eventAdmin.forge({ userId: userId })
                .fetch()
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
     * @param {integer}  eventId - Integer identifying an eventAdmin
     *
     * @return {object} object -  EventAdmin  Object / error {include all events attached to admin}
     */
    getEventAdminByEventId (eventId) {
        return new Promise((resolve, reject)=> {
            this.eventAdmin.query(qb => {qb.where('event_id', '=', eventId);})
                .fetchAll({ withRelated: [{ event: function (query) { query.select('id', 'title');} },

                    { user: function (query) {query.select('id', 'name');} }
                ] })
                .then(data => {
                    console.log(`Get eventAdmin Data => ${JSON.stringify(data)}`);
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
     * @return {object} object -  Object containing all eventAdmins / error
     */
    getAllEventAdmin () {
        return new Promise((resolve, reject)=> {
            this.eventAdmin.forge().fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    console.log(`GET ALL EVENT ADMIN ERROR => ${error}`);
                    return reject(error);
                });
        });
    }

    /**
     *@param {integer} userId - the userId of the eventAdmin
     *@description Get  all eventAdmins
     *
     * @return {Promise} promise -  Promise bject containing all eventAdmin with all his events / error
     */
    getAllEventsOfEventAdmin (userId) {
        return new Promise((resolve, reject)=> {
            this.eventAdmin.query(qb => {qb.where('user_id', '=', userId )})
                .fetchAll({ withRelated: ['event'] })
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    console.log(`GET ALL EVENT ADMIN ERROR => ${error}`);
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
        return new Promise((resolve, reject)=> {
            this.getEventAdmin(eventAdminId)
                .then((eventAdmin) => {
                    BookShelf.transaction((transaction) => {
                        this.eventAdmin.forge({ id: eventAdmin.id })
                            .destroy({ transacting: transaction })
                            .then(() => {
                                let userId = eventAdmin.attributes.user_id;
                                let itemId = eventAdmin.attributes.id;
                                let eventGroupId = constants.DATA_GROUP.EVENT.id;
                                let eventAdminGroupId = constants.DATA_GROUP.EVENTADMIN.id;
                                Promise.all([this.roleUserService.deleteRoleUserAtUser(userId, itemId, eventGroupId,
                                    transaction), this.roleUserService.deleteRoleUserAtUser(userId, itemId, eventAdminGroupId,
                                    transaction)]).then(()=> {
                                    transaction.commit();
                                    console.log(`"eventAdmin deleted successfully" `);
                                    return resolve({ message: 'eventAdmin deleted successfully' });
                                })
                                    .catch((error) => {
                                        console.log(`Transaction Error deleting EventAdmin => ${error}`);
                                        throw error;
                                    });
                            })
                            .catch((error) => {
                                console.log(`Transaction Error deleting EventAdmin => ${error}`);
                                throw error;
                            });
                    });
                })
                .catch((error) => {
                    console.log(`GEt Transaction Error deleting EventAdmin => ${error}`);
                    reject(error);
                });
        });
    }
}

module.exports = EventAdminService;
