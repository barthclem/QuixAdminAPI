/**
 * Created by barthclem on 5/17/17.
 */
let Joi = require('joi');

module.exports = {
    createEventAdmin: {
        event_id : Joi.number().integer().required(),
        user_id : Joi.number().integer().required()
    },
    editEventAdmin: {
        event_id : Joi.number().integer().optional(),
        user_id : Joi.number().integer().optional()
    },
    getEventAdmin: {
        id: Joi.number().integer().optional(),
        event_id : Joi.number().integer().optional(),
        user_id : Joi.number().integer().optional(),
    }
};