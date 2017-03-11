"use strict";
exports.up = function(knex) {
  return knex.schema.table('user', table => {
      table.string('username').unique().notNullable();
      });
};

exports.down = function(knex) {
  return knex.schema.table('user', table => {
      table.dropColumn('username');
  })
};
