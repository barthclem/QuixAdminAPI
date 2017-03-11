'use strict';
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('emailAuth', table =>{
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('user.id');
      table.string('email').notNullable();
      table.string('email_auth_code');
      table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('emailAuth');
};
