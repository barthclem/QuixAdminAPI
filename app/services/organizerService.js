'use strict';
/**
 *@description this is class handles all action that can be performed by a participant
 */
let BookShelf = require('../bookshelf');
let constants = require('../config/constants');
class OrganizerService {

    /**
     *
     *@description Organizer Service Constructor
     *
     *@param  {object} organizer - organizer model instance
     *@param {object}  event - event model instance
     * @param {object}  roleService - role service instance
     *
     */
    constructor (organizer, event, roleService) {
        this.organizer = organizer;
        this.event = event;
        this.roleService = roleService;
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
            BookShelf.transaction((transaction) => {
                this.organizer.forge().save(organizerData, {transacting : transaction})
                    .tap(organizer => {
                        let roleUser = {
                            user_id: organizer.attributes.user_id,
                            role_title : constants.ROLES.ORGANIZER,
                            itemId : organizer.attributes.id,
                            data_group_id: constants.DATA_GROUP.ORGANIZER.id
                        };
                       this.roleService.createRoleUserTransaction(roleUser, transaction)
                           .then(roleData => {
                               transaction.commit(organizer);
                               return resolve(organizer);
                           })
                           .catch(error => {
                               return reject(error);
                           })
                    })
                    .then(data => {
                        console.log(`Organizer data Transaction Successful => ${data}`);
                    })
                    .catch(error => {
                        console.log(`Organizer Transaction error => ${error}`);
                        return reject(error);
                    });
            });
        });
    }

    /**
     *
     *@description Edit an organizer
     *
     * @param {Integer}  organizerId - Integer identifying an Organizer
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
     * @param {Integer}  organizerId - Integer identifying an Organizer
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
            BookShelf.transaction((transaction) => {
                this.organizer.forge({id : organizerId})
                    .destroy({transacting: transaction})
                    .tap(() => {
                        this.getOrganizer(organizerId)
                            .then(data => {
                                let userId = data.attributes.user_id;
                                let itemId = data.attributes.id;
                                let dataGroupId = constants.DATA_GROUP.ORGANIZER.id;
                                this.roleService.deleteRoleUserAtUser(userId, itemId, dataGroupId, transaction)
                                    .then( () => {
                                        transaction.commit();
                                        console.log(`"organizer deleted successfully" `);
                                        return resolve({message : "organizer deleted successfully"});
                                    })
                            })
                            .catch(error => {
                                throw error;
                            });
                    })
                    .then(() => {
                        return resolve({message : "organizer deleted successfully"});
                    })
                    .catch(error => {
                        transaction.rollback();
                        console.log(`Unable to delete organizer due to => ${error}`);
                        return reject(error);
                    });
            });
        });
    }



}

module.exports = OrganizerService;