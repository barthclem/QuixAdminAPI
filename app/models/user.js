/**
 * Created by aanu.oyeyemi on 19/02/2017.
 */
'use strict';

let bookshelf = require ('../bookshelf');
let emailAuth = require('./emailAuth');

let user = bookshelf.Model.extend({
    tableName : "user",
    hidden : ['id'],

    emailAuth : function () {
        return this.hasMany(emailAuth);
    }
});

module.exports = bookshelf.model('user', user);