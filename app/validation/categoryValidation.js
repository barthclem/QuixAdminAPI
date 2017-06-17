/**
 * Created by barthclem on 5/26/17.
 */
let Joi = require('joi');

module.exports = {
    createCategory: {
        body: {
            event_id : Joi.number().integer().required(),
            created_by: Joi.number().integer().required(),
            has_bonus: Joi.boolean().required(),
            question_time: Joi.number().integer().required(),
            bonus_time: Joi.number().integer().required(),
            question_grade: Joi.number().integer().required(),
            bonus_grade: Joi.number().integer().required()
        }
    },
    editCategory: {
        params: {
            id: Joi.number().integer().required()
        },
        body: {
            event_id : Joi.number().integer().optional(),
            created_by: Joi.number().integer().optional(),
            has_bonus: Joi.boolean().optional(),
            question_time: Joi.number().integer().optional(),
            bonus_time: Joi.number().integer().optional(),
            question_grade: Joi.number().integer().optional(),
            bonus_grade: Joi.number().integer().optional()
        }
    },
    getCategory: {
        params: {
            id: Joi.number().integer().required()
        }
    }
};