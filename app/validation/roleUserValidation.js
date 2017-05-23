/**
 * Created by barthclem on 5/11/17.
 */
let joi = require('joi');

module.exports =  {
    newRoleUser : {
        body : {
            user_id: joi.number().integer().required(),
            role_title : joi.string().required(),
            itemId : joi.number().integer().optional(),
            data_group_id: joi.number().integer().required()
        }
    },

    getRoleUser : {
        params: {
            id : joi.number().integer().required()
        }
    },

    getRoleUserId : {
        params : {
            user_id : joi.number().integer().required()
        }
    },

    editRoleUser : {
        params: {
          id: joi.number().integer().optional()
        },
        body: {
            user_id: joi.number().integer().optional(),
            title : joi.string().optional(),
            role_id: joi.number().integer().optional(),
            itemId : joi.number().integer().optional(),
            data_group_id: joi.number().integer().optional()
        }
    }
};