
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('user', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('password').notNullable();
      table.string('email');
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user');
};
