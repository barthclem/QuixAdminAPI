/**
 * Created by barthclem on 5/11/17.
 */
let joi = require('joi');;

module.exports = {
    createParticipant: {
        body: {
            event_id: joi.number().integer().required(),
            user_id : joi.number().integer().required()
        }
    },

    updateParticipant: {
        params: {
            id: joi.number().integer().optional(),
            user_id: joi.number().integer().optional()
        },
        body: {
            event_id: joi.number().integer().optional(),
            user_id : joi.number().integer().optional(),
            score : joi.number().optional(),
            status: joi.string().valid(['suspended', 'inactive','active', 'banned']).optional()
            }
    },

    getParticipant: {
        params: {
            id: joi.number().integer().optional(),
            user_id: joi.number().integer().optional()
        }
    }
};