let disposable = require('../app/lib/disposable');
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('permission').del()
    .then(function () {
        let inputArray =
        disposable(` 
        VIEW_ONGOING_EVENTS : 'view_ongoing_events',
         GET_ALL_USERS : 'get_all_users',
       GET_A_USER : 'get_a_user',
       CREATE_A_USER : 'create_a_user',
       UPDATE_A_USER  : 'update_a_user',
       DELETE_A_USER : 'delete_a_user',
       REGISTER_FOR_EVENT : 'register_for_event',
       DEREGISTER_AN_EVENT : 'deregister_an_event',
       ADD_EVENT_ADMIN : 'add_event_admin',
       EDIT_EVENT_ADMIN : 'edit_event_admin',
       DELETE_EVENT_ADMIN : 'delete_event_admin',
       PARTICIPATE_IN_AN_EVENT : 'participate_in_an_event',
       REGISTER_AN_EVENT : 'register_event',
       START_AN_EVENT : 'start_an_event',
       CANCEL_AN_EVENT : 'cancel_an_event',
       VIEW_ALL_EVENTS : 'view_all_events',
       ADD_ORGANIZER : 'add_organizer',
       EDIT_ORGANIZER : 'edit_organizer',
       DELETE_ORGANIZER : 'delete_organizer',
        ADD_A_PARTICIPANTS : 'add_a_participant',
       DELETE_A_PARTICIPATE : 'delete_a_participant',
       SUSPEND_A_PARTICIPANT : 'suspend_a_participant',
       SEND_MESSAGE_TO_PARTICIPANT : 'send_a_message_participant',
       VIEW_ALL_PARTICIPANTS : 'view_all_participants',
        CREATE_A_CATEGORY : 'create_a_category',
       ADD_A_CATEGORY_ADMIN : 'add_category_admin',
       EDIT_A_CATEGORY_ADMIN : 'edit_category_admin',
       EDIT_A_CATEGORY : 'edit_category_configuration',
       EDIT_ALL_CATEGORIES : 'edit_all_categories',
       DELETE_A_CATEGORY : 'delete_a_category',
       DELETE_ALL_CATEGORIES : 'delete_all_categories',
       DELETE_A_CATEGORY_ADMIN : 'delete_a_category_admin',
       CREATE_ROLE_USER : 'create_a_role_user',
       DELETE_USER_ROLE: 'delete_a_role_user',
       EDIT_USER_ROLE : 'edit_a_role_user',
       GET_ROLE_USER : 'get_role_user'`);
      // Inserts seed entries
      return knex('permission').insert(inputArray);
    });
};
