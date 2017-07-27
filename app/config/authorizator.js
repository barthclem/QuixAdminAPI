/**
*This is the config file that defines Role Base Access Control of the system
*/
'use strict';
let authorizor = require('authorizator');
let rolePolicy = authorizor.ActionBasedPolicy;
let Role = require('../lib/rbac/roleBase');
let constants = require('./constants');
let PERMISSIONS = constants.PERMISSIONS;
authorizor.initialize({ path: 'session.role' });
authorizor.use('redisPolicy', rolePolicy);

//TODO keep this in an in-memory database
let guest = new Role(authorizor, constants.ROLES.GUEST);
let participant = new Role(authorizor, constants.ROLES.PARTICIPANT);
let organiser = new Role(authorizor, constants.ROLES.ORGANIZER);
let eventAdmin = new Role(authorizor, constants.ROLES.EVENT_ADMIN);
let categoryAdmin = new Role(authorizor, constants.ROLES.CATEGORY_ADMIN);
//let systemAdmin = new Role(authorizor, constants.ROLES.APP_ADMIN);
let superAdmin = new Role(authorizor, constants.ROLES.SUPERADMIN);

module.exports = (()=> {

    guest.canDo(PERMISSIONS.GENERAL.VIEW_ONGOING_EVENTS,
                         PERMISSIONS.EVENT.VIEW_ALL_EVENTS,
                         PERMISSIONS.EVENT.VIEW_AN_EVENT);
    participant.canDo(PERMISSIONS.USER.GET_A_USER,
                      PERMISSIONS.USER.UPDATE_A_USER,
                      PERMISSIONS.PARTICIPANT.DELETE_A_PARTICIPANT,
                      PERMISSIONS.PARTICIPANT.EDIT_A_PARTICIPANT,
                      PERMISSIONS.PARTICIPANT.VIEW_A_PARTICIPANT,
                      PERMISSIONS.EVENT.VIEW_ALL_EVENTS,
                      PERMISSIONS.EVENT.REGISTER_FOR_EVENT,
                      PERMISSIONS.EVENT.DEREGISTER_AN_EVENT);

    participant.inherit(guest.role);

    categoryAdmin.canDo(PERMISSIONS.CATEGORY.EDIT_A_CATEGORY);
    categoryAdmin.inherit(guest.role);

    eventAdmin.canDo(
                    PERMISSIONS.PARTICIPANT.ADD_A_PARTICIPANTS,
                    PERMISSIONS.PARTICIPANT.DELETE_A_PARTICIPANT,
                    PERMISSIONS.PARTICIPANT.EDIT_A_PARTICIPANT,
                    PERMISSIONS.PARTICIPANT.SEND_MESSAGE_TO_PARTICIPANT,
                    PERMISSIONS.PARTICIPANT.VIEW_ALL_PARTICIPANTS,
                    PERMISSIONS.EVENT.EDIT_AN_EVENT,
                    PERMISSIONS.CATEGORY.CREATE_A_CATEGORY,
                    PERMISSIONS.CATEGORY.VIEW_ALL_CATEGORIES,
                    PERMISSIONS.CATEGORY.VIEW_A_CATEGORY,
                    PERMISSIONS.CATEGORY.ADD_A_CATEGORY_ADMIN,
                    PERMISSIONS.CATEGORY.EDIT_A_CATEGORY,
                    PERMISSIONS.CATEGORY.EDIT_A_CATEGORY_ADMIN,
                    PERMISSIONS.CATEGORY.EDIT_ALL_CATEGORIES,
                    PERMISSIONS.CATEGORY.DELETE_A_CATEGORY,
                    PERMISSIONS.CATEGORY.DELETE_ALL_CATEGORIES,
                    PERMISSIONS.CATEGORY.DELETE_A_CATEGORY_ADMIN,
                    PERMISSIONS.EVENT.START_AN_EVENT);

    eventAdmin.inherit(categoryAdmin.role);

    organiser.canDo(
        PERMISSIONS.EVENT.VIEW_AN_EVENT_ADMIN,
        PERMISSIONS.EVENT.VIEW_ALL_EVENT_ADMINS,
        PERMISSIONS.EVENT.ADD_EVENT_ADMIN,
        PERMISSIONS.EVENT.EDIT_EVENT_ADMIN,
        PERMISSIONS.EVENT.DELETE_EVENT_ADMIN,
        PERMISSIONS.EVENT.REGISTER_AN_EVENT,
        PERMISSIONS.EVENT.CANCEL_AN_EVENT,
        PERMISSIONS.ORGANIZER.EDIT_ORGANIZER,
        PERMISSIONS.ORGANIZER.GET_AN_ORGANIZER);
    organiser.inherit(eventAdmin.role);

    superAdmin.canDo(
        PERMISSIONS.ROLE_USER.GET_ROLE_USER,
        PERMISSIONS.ROLE_USER.CREATE_ROLE_USER,
        PERMISSIONS.ROLE_USER.EDIT_USER_ROLE,
        PERMISSIONS.ROLE_USER.DELETE_USER_ROLE,
        PERMISSIONS.USER.GET_A_USER,
        PERMISSIONS.USER.UPDATE_A_USER,
        PERMISSIONS.USER.DELETE_A_USER,
        PERMISSIONS.EVENT.VIEW_ALL_EVENTS,
        PERMISSIONS.EVENT.REGISTER_FOR_EVENT,
        PERMISSIONS.EVENT.DEREGISTER_AN_EVENT,
        PERMISSIONS.PARTICIPANT.VIEW_A_PARTICIPANT,
        PERMISSIONS.USER.GET_ALL_USERS,
        PERMISSIONS.ORGANIZER.VIEW_ALL_ORGANIZERS,
        PERMISSIONS.ORGANIZER.ADD_ORGANIZER,
        PERMISSIONS.ORGANIZER.DELETE_ORGANIZER);

    superAdmin.inherit(organiser.role);

    return authorizor;
})();
