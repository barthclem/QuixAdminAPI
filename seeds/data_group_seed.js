'use strict';
let constants = require('../app/config/constants');
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('data_group').del()
    .then(function () {
      // Inserts seed entries
      return knex('data_group').insert([
          {id: 1, group_name: constants.DATA_GROUP.CATEGORY.title},
          {id: 2, group_name: constants.DATA_GROUP.CATEGORYADMIN.title},
          {id: 3, group_name: constants.DATA_GROUP.EVENT.title},
          {id: 4, group_name: constants.DATA_GROUP.EVENTADMIN.title},
          {id: 5, group_name: constants.DATA_GROUP.ORGANIZER.title},
          {id: 6, group_name: constants.DATA_GROUP.PARTICIPANT.title},
          {id: 7, group_name: constants.DATA_GROUP.USER.title},
          {id: 8, group_name: constants.DATA_GROUP.ROLE_USER.title}

      ]);
    });
};
