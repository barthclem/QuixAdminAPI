/**
 * Created by barthclem on 5/15/17.
 */
let Joi = require('joi');

module.exports = {
    createOrganizer : {
        body : {
            organizername : Joi.string().regex(/[A-Za-z]{3,}(\s)*([A-Za-z]{2,})/g).required(),
            user_id : Joi.number().integer().required()
        }
    },

    updateOrganizer : {
        params : {
            id: Joi.number().integer().required(),
            user_id : Joi.number().integer().optional()
        },
        body : {
            organizername : Joi.string().regex(/[A-Za-z]{3,}(\s)*[A-Za-z]{2,}/g).required(),
        }
    },

    getOrganizer : {
        params : {
            id: Joi.number().integer().required(),
            user_id : Joi.number().integer().optional()
        }
    }
};