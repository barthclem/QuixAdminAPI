'use strict';
exports.up = function (knex) {
    return knex.schema
        //USER schema
        .createTableIfNotExists('user', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('password').notNullable();
            table.enum('status', ['notVerified', 'verified', 'active', 'banned']).default('notVerified');
            table.string('username').unique().notNullable();
            table.string('email');
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
        })
        .createTableIfNotExists('organizer', (table) => {
            table.increments('id').primary();
            table.string('organizername').default('');
            table.integer('user_id').unsigned().unique().references('id').inTable('user');
        })
        .createTableIfNotExists('emailAuth', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('user.id');
            table.string('email').notNullable();
            table.string('email_auth_code');
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
        })
        //Permissions and Roles
        .createTableIfNotExists('role', (table) => {
            table.primary(['id', 'title']);
            table.integer('id').unsigned();
            table.string('title').unique();
        })
        //add a primary key to the role table
        .raw('Alter Table role modify id int unsigned auto_increment')

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
            table.enum('status', ['open', 'closed', 'banned']).default('open');
            table.date('scheduled_at');
            table.integer('organizer_id').unsigned().references('id').inTable('organizer');
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
        })
        .createTableIfNotExists('eventAdmin', (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().references('event.id');
            table.integer('user_id').unsigned().references('user.id');
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
        })
        .createTableIfNotExists('participant', (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().references('event.id');
            table.integer('user_id').unsigned().references('user.id');
            table.enum('status', ['suspended', 'inactive', 'active', 'banned']).default('active');
            table.integer('score').unsigned().default(0);
        })
        .createTableIfNotExists('category', (table) => {
            table.increments('id').primary();
            table.integer('event_id').unsigned().references('event.id');
            table.integer('created_by').unsigned().references('user.id');
            table.boolean('has_bonus');
            table.integer('question_time').unsigned();
            table.integer('bonus_time').unsigned();
            table.float('question_grade');
            table.float('bonus_grade');
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
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
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
        })
        .createTableIfNotExists('data_group', (table) => {
            table.increments('id').primary();
            table.string('group_name').unique().notNullable();
        })
        //Role And User Join table
        .createTableIfNotExists('user_role', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('user.id');
            table.string('role_title').notNullable().references('role.title');
            table.integer('itemId').unsigned().notNullable();
            table.integer('data_group_id').unsigned().notNullable().references('data_group.id');
            table.timestamp('created_at', true).defaultTo(knex.raw('now()')).notNullable();
            table.timestamp('updated_at', true).defaultTo(knex.raw('now()')).notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('user')
        .dropTableIfExists('emailAuth')
        .dropTableIfExists('organizer')
        .dropTableIfExists('participant')
        .dropTableIfExists('role')
        .dropTableIfExists('role_permission')
        .dropTableIfExists('permission')
        .dropTableIfExists('event')
        .dropTableIfExists('eventAdmin')
        .dropTableIfExists('category')
        .dropTableIfExists('category_entry');

};
