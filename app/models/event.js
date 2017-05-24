/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');
let event = bookshelf.Model.extend({
    idAttribute : 'id',
    //hidden : ['id'],
    tableName : 'event',

    category : function (){
        return this.hasMany('category');
    },
    participant : function (){
        return this.belongsToMany('participant', 'participant_event', 'event_id', 'participant_id');
    },

    organizer : function (){
        return this.belongsTo('organizer');
    },

    eventAdmin : function (){
        return this.hasMany('eventAdmin');
    }

});

module.exports = bookshelf.model('event', event);