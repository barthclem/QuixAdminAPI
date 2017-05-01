/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');
let event = bookshelf.Model.extend({
    idAttribute : 'id',
    hidden : ['id'],
    tableName : 'event',

    category : ()=>{
        return this.hasMany('category');
    },
    participant : ()=>{
        return this.hasMany('participant');
    },

    organizer : ()=>{
        return this.belongsTo('organizer');
    },

    eventAdmin : ()=>{
        return this.hasMany('eventAdmin');
    }

});

module.exports = bookshelf.model('event', event);