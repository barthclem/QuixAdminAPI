/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let categoryEntry = bookshelf.Model.extend({
    idAttribute : 'id',
    hidden : ['id'],
    tableName : 'category_entry',

    category : () => {
        return this.belongsTo('category');
    }
});

module.exports = bookshelf.model('categoryEntry', categoryEntry);