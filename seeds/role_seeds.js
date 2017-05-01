
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('role').del()
    .then(function () {
      // Inserts seed entries
      return knex('role').insert([
          {id: 1, title: 'guest'},
          {id: 2, title: 'user'},
          {id: 3, title: 'participant'},
          {id: 4, title: 'organizer'},
          {id: 5, title: 'event_admin'},
          {id: 6, title: 'category_admin'},
          {id: 7, title: 'app_admin'},
          {id: 8, title: 'super_admin'}
      ]);
    });
};

