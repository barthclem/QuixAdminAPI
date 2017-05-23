/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let category = bookshelf.Model.extend({
    idAttribute : 'id',
    tableName : 'category',

    event : () => {
        return this.belongsTo('event');
    },

    categoryEntry : () => {
        return this.hasMany('categoryEntry');
    }

});

module.exports = (()=>{
    console.log(`what is this =>  ${JSON.stringify(bookshelf)}`);
    return bookshelf.model('category', category);})();