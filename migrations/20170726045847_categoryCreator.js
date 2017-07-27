'use strict';
exports.up = function (knex, Promise) {
    return knex.schema.table('category', (table) => {
        table.integer('created_by').unsigned().references('user.id')
            }).table('category_entry', (table) => {
        table.integer('updated_by').unsigned().references('user.id');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('category', (table) => {
        table.integer('created_by').unsigned().references('eventAdmin.id');
    }).table('category_entry', (table) => {
        table.dropColumn('updated_by');
    });
};
