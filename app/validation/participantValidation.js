/**
 * Created by barthclem on 5/11/17.
 */
let joi = require('joi');

module.exports = {
    createParticipant: {
        body: {
            event_id: joi.number().integer().required(),
            user_id : joi.number().integer().required()
        }
    },

    createParticipantWithLink: {
        params: {
            event_link: joi.string().required()
        },
        body: {
            user_id : joi.number().integer().optional()
        }
    },

    updateParticipant: {
        query: {
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
            id: joi.number().min(0).max(1000).required(),
            user_id: joi.number().integer().optional()
        }
    },

    getParticipantByEvent: {
        query: {
            event_id : joi.number().integer().optional()
        }
    }
};