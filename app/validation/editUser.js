'use strict';

let Joi = require('joi');

module.exports = {

  body: {
     username : Joi.string().optional(),
     email : Joi.string().email().optional(),
     password : Joi.string().optional()
  }

};
