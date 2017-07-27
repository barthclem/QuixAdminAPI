'use strict';
exports.up = function (knex) {
    return knex.schema.table('event', (table) => {
        table.string('details').notNullable();
        table.string('icon');
    });
};

exports.down = function (knex) {
    return knex.schema.table('event', (table) => {
        table.dropColumn('details');
        table.dropColumn('icon');
    });
};
