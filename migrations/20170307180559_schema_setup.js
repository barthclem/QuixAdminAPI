'use strict';
exports.up = function(knex) {
  return knex.schema
      //USER schema
      .createTableIfNotExists('user', (table) => {
          table.increments('id').primary();
          table.string('name').notNullable();
          table.string('password').notNullable();
          table.enum('status', ['notVerified', 'verified','active', 'banned']);
          table.string('username').unique().notNullable();
          table.string('email');
          table.timestamps();
      })
      .createTableIfNotExists('organizer', (table) => {
          table.increments('id').primary();
          table.string('username').default('');
          table.integer('user_id').unsigned().references('id').inTable('user');
      })
      .createTableIfNotExists('emailAuth', table => {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable().references('user.id');
          table.string('email').notNullable();
          table.string('email_auth_code');
          table.timestamps();
      })
      //Permissions and Roles
      .createTableIfNotExists('role', (table) => {
          table.increments('id').primary();
          table.string('title');
      })
      .createTableIfNotExists('permission', (table) => {
          table.increments('id').primary();
          table.string('title').notNullable();
      })
      .createTableIfNotExists('role_permission', (table) => {
          table.increments('id').primary();
          table.integer('role_id').unsigned().references('id').inTable('role');
          table.integer('permission_id').unsigned().references('id').inTable('permission');
      })
      //Events
      .createTableIfNotExists('event', (table) => {
          table.increments('id').primary();
          table.string('title').notNullable().unique();
          table.string('link').unique();
          table.date('scheduled_at');
          table.integer('organizer_id').unsigned().references('id').inTable('organizer');
          table.timestamps();
      })
      .createTableIfNotExists('participant', (table) => {
          table.increments('id').primary();
          table.integer('event_id').unsigned().references('event.id');
          table.integer('user_id').unsigned().references('user.id');
          table.integer('score').unsigned().default(0);
      })
      .createTableIfNotExists('category', (table) => {
          table.increments('id').primary();
          table.integer('event_id').unsigned().references('event.id');
          table.string('created_by').unsigned().references('eventAdmin.id');
          table.boolean('has_bonus');
          table.integer('question_time').unsigned();
          table.integer('bonus_time').unsigned();
          table.float('question_grade').unsigned();
          table.float('bonus_grade').unsigned();
          table.timestamps();
      })
      .createTableIfNotExists('category_entry', (table) => {
          table.increments('id').primary();
          table.integer('category_id').unsigned().references('category.id');
          table.text('question').notNullable();
          table.boolean('hasOptions');
          table.string('optionA');
          table.string('optionB');
          table.string('optionC');
          table.string('optionD');
          table.string('optionE');
          table.string('answer').notNullable();
          table.float('time_allowed');
          table.timestamps();
      })
      //Role And User Join table
      .createTableIfNotExists('user_role', (table) => {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable().references('user.id');
          table.integer('role_id').unsigned().notNullable().references('role.id');
          table.integer('event_id').unsigned().notNullable().references('event.id');
      })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('user')
        .dropTableIfExists('emailAuth')
        .dropTableIfExists('organizer')
        .dropTableIfExists('participant')
        .dropTableIfExists('role')
        .dropTableIfExists('role_permission')
        .dropTableIfExists('permission')
        .dropTableIfExists('event')
        .dropTableIfExists('category')
        .dropTableIfExists('category_entry');

};
