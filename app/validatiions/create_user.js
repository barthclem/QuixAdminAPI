/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';
let joi = require('joi');
module.exports = {
    fullname : joi.string().required(),
    email : joi.string().noHtml().required(),
    username : joi.string().noHtml().required(),
    password : joi.string().required()
};