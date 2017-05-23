/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
let knex = require('./config/database');
let bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');
bookshelf.plugin('visibility');
bookshelf.plugin(require('bookshelf-soft-delete'));

module.exports = bookshelf;