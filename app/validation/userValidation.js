/**
 * Created by aanu.oyeyemi on 01/05/2017.
 */
'use strict';

let Joi = require('joi');

module.exports = {

    login : {
        body : {
            email : Joi.string().email().required(),
            password : Joi.string().required()
        }
    },
    signUp : {
        body : {
            name : Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    getUser : {
        params : {
            id : Joi.number().integer().optional(),
            username : Joi.string().regex(/^([a-zA-Z]{3,})([[a-zA-Z0-9_\.]*)$/).optional()
        }
    },
    getVerification : {
      params : {
          token : Joi.string().regex(/^[A-Za-z0-9\-]{36}$/).required()
      }
    },
    editUser : {
        params : {
            id : Joi.number().integer().required()
        },
        body :{
            username : Joi.string().optional(),
            email : Joi.string().email().optional(),
            password : Joi.string().optional()
        }
    }

};
