/**
 * Created by barthclem on 4/22/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let roleUser = bookshelf.Model.extend({
    idAttribute : 'id',
    tableName : 'user_role',
    hidden : ['id'],

    user : () => {
        return this.hasOne('user');
    },
    event : () => {
        return this.hasOne('event');
    },
    role : () => {
        return this.hasOne('role');
    }

});

module.exports = bookshelf.model('roleUser', roleUser);