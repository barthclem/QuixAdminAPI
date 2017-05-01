/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let participant = bookshelf.Model.extend({
    idAttribute : 'id',
    hidden : ['id'],
    tableName : 'participant',

    event : () => {
        return this.belongsToMany('event')
    }
});

module.exports = bookshelf.model('participant', participant);
