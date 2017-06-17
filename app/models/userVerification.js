/**
 * Created by barthclem on 6/3/17.
 */
'use strict';

let bookshelf = require ('../bookshelf');

let userVerification = bookshelf.Model.extend({
    idAttribute: 'id',
    tableName: 'verification_list'
    }
);

module.exports = bookshelf.model('userVerification', userVerification);
