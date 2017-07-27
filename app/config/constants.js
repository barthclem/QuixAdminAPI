'use strict';

module.exports = {

    PERMISSIONS: {

        GENERAL: {
            VIEW_ONGOING_EVENTS: 'view_ongoing_events'
        },

        USER: {
            GET_ALL_USERS: 'get_all_users',
            GET_A_USER: 'get_a_user',
            CREATE_A_USER: 'create_a_user',
            UPDATE_A_USER: 'update_a_user',
            DELETE_A_USER: 'delete_a_user'
        },

        EVENT: {
            REGISTER_FOR_EVENT: 'register_for_event',
            DEREGISTER_AN_EVENT: 'deregister_an_event',
            ADD_EVENT_ADMIN: 'add_event_admin',
            EDIT_EVENT_ADMIN: 'edit_event_admin',
            DELETE_EVENT_ADMIN: 'delete_event_admin',
            PARTICIPATE_IN_AN_EVENT: 'participate_in_an_event',
            REGISTER_AN_EVENT: 'register_event',
            START_AN_EVENT: 'start_an_event',
            CANCEL_AN_EVENT: 'cancel_an_event',
            VIEW_AN_EVENT: 'view_an_event',
            EDIT_AN_EVENT: 'edit_an_event',
            VIEW_AN_EVENT_ADMIN: 'view_an_event_admin',
            VIEW_ALL_EVENTS: 'view_all_events',
            VIEW_ALL_EVENT_ADMINS: 'view_all_event_admins'
        },

        ORGANIZER: {
            ADD_ORGANIZER: 'add_organizer',
            GET_AN_ORGANIZER: 'get_an_organizer',
            VIEW_ALL_ORGANIZERS: 'get_all_organizer',
            EDIT_ORGANIZER: 'edit_organizer',
            DELETE_ORGANIZER: 'delete_organizer'
        },
        PARTICIPANT: {
            ADD_A_PARTICIPANTS: 'add_a_participant',
            DELETE_A_PARTICIPANT: 'delete_a_participant',
            EDIT_A_PARTICIPANT: 'edit_a_participant',
            SEND_MESSAGE_TO_PARTICIPANT: 'send_a_message_participant',
            VIEW_ALL_PARTICIPANTS: 'view_all_participants',
            VIEW_A_PARTICIPANT: 'view_a_participant'
        },

        CATEGORY: {
            CREATE_A_CATEGORY: 'create_a_category',
            ADD_A_CATEGORY_ADMIN: 'add_category_admin',
            VIEW_A_CATEGORY: 'view_a_category',
            VIEW_CATEGORY_ADMIN: 'view_category_admin',
            VIEW_ALL_CATEGORIES: 'view_all_categories',
            VIEW_ALL_CATEGORY_ADMINS: 'view_all_category_admin',
            EDIT_A_CATEGORY_ADMIN: 'edit_category_admin',
            EDIT_A_CATEGORY: 'edit_a_category',
            EDIT_ALL_CATEGORIES: 'edit_all_categories',
            DELETE_A_CATEGORY: 'delete_a_category',
            DELETE_ALL_CATEGORIES: 'delete_all_categories',
            DELETE_A_CATEGORY_ADMIN: 'delete_a_category_admin'
        },

        ROLE_USER: {
            CREATE_ROLE_USER: 'create_a_role_user',
            DELETE_USER_ROLE: 'delete_a_role_user',
            EDIT_USER_ROLE: 'edit_a_role_user',
            GET_ROLE_USER: 'get_role_user'
        }

    },

    ROLES: {
        GUEST: 'guest',
        USER: 'user',
        PARTICIPANT: 'participant',
        ORGANIZER: 'organizer',
        EVENT_ADMIN: 'event_admin',
        CATEGORY_ADMIN: 'category_admin',
        APP_ADMIN: 'app_admin',
        SUPERADMIN: 'super_admin'
    },

    DATA_GROUP: {
        CATEGORY: { title: 'category', id: 1 },
        CATEGORYADMIN: { title: 'categoryAdmin', id: 2 },
        CATEGORY_ENTRY: { title: 'categoryEntry', id: 10 },
        EVENT: { title: 'event', id: 3 },
        EVENTADMIN: { title: 'eventAdmin', id: 4 },
        ORGANIZER: { title: 'organizer', id: 5 },
        PARTICIPANT: { title: 'participant', id: 6 },
        ROLE_USER: { title: 'roleUser', id: 8 },
        USER: { title: 'user', id: 7 },
        ROLE: { title: 'role', id: 9 },
        GUEST: { title: 'guest', id: 11 }
    },
    UTILITY: {
        VERIFIED: 'verified',
        UNVERIFIED: 'unVerified'
    }

};
