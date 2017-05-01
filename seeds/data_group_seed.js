'use strict';
let constants = require('../app/config/constants');
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('data_group').del()
    .then(function () {
      // Inserts seed entries
      return knex('data_group').insert([
        {id: 1, group_name: constants.DATA_GROUP.CATEGORY},
        {id: 2, group_name: constants.DATA_GROUP.CATEGORYADMIN},
        {id: 3, group_name: constants.DATA_GROUP.EVENT},
        {id: 4, group_name: constants.DATA_GROUP.EVENTADMIN},
        {id: 5, group_name: constants.DATA_GROUP.ORGANIZER},
        {id: 6, group_name: constants.DATA_GROUP.PARTICIPANT},
        {id: 7, group_name: constants.DATA_GROUP.USER}

      ]);
    });
};
