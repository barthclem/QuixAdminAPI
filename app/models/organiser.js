/**
 * Created by barthclem on 4/19/17.
 */

'use strict';

let bookshelf = require ('../bookshelf');

let organizer = bookshelf.Model.extend({
    idAttribute : 'id',
    hidden : ['id'],
    tableName : "organizer",

    user : function () {
        return this.belongsTo('user');
    },
    eventAdmin : function () {
        return this.hasMany('eventAdmin');
    },

    event : function () {
        return this.hasMany('event');
    }

});

module.exports = bookshelf.model('organizer', organizer);