/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let participant = bookshelf.Model.extend({
    idAttribute : 'id',
    hidden : ['id'],
    tableName : 'participant',

    user : function () {
        return this.belongsTo('user');
    },

    event : function () {
        return this.belongsToMany('event', 'participant_event','participant_id', 'event_id');
    }
});

module.exports = bookshelf.model('participant', participant);
