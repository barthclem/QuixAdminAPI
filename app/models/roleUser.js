/**
 * Created by barthclem on 4/22/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let roleUser = bookshelf.Model.extend({
    idAttribute : 'id',
    tableName : 'user_role',
    hidden : ['id'],

    user : function () {
        return this.hasOne('user');
    },
    event : function ()  {
        return this.hasOne('event');
    },
    role : function ()  {
        return this.hasOne('role','title', 'role_title');
    }

});

module.exports = bookshelf.model('roleUser', roleUser);