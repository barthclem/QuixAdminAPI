'use strict';
exports.up = function (knex) {
    return knex.schema.createTableIfNotExists('participant_event', (table) => {
        table.increments('id');
        table.integer('participant_id').unsigned().notNullable().references('participant.id');
        table.integer('event_id').unsigned().notNullable().references('event.id');
    });
};

exports.down = function (knex) {
    return knex.dropTableIfExists('participant_event');
};
