"use strict";
exports.up = function(knex) {
    return knex.schema.table('user', table => {
        table.enum('status', ['notVerified', 'verified','active', 'banned']);
    });
};

exports.down = function(knex) {
    return knex.schema.table('user', table => {
        table.dropColumn('status');
    })
};
