/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';
let bookshelf = require('../bookshelf');
let user = require('./user');

let emailAuth = bookshelf.Model.extend({
    tableName : 'emailAuth',
    hidden : ['id'],
    idAttribute : 'id',

    user : function () {
        return this.belongsTo(user);
    }

});

module.exports = bookshelf.model('emailAuth', emailAuth);