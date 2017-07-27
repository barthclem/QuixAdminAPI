'use strict';
exports.up = function (knex) {
    return knex.schema.table('user', (table) => {
        table.string('picture').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table('event', (table) => {
        table.dropColumn('picture');
    });
};
