/**
 * Created by barthclem on 4/23/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let role = bookshelf.Model.extend({
        idAttribute: 'id',
        tableName: 'role',
        hidden: ['id']
    }
);

module.exports = bookshelf.model('role', role);
