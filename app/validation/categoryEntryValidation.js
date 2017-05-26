/**
 * Created by barthclem on 5/26/17.
 */
let Joi = require('joi');
module.exports = {
    createCategoryEntry : {
        body: {
            category_id : Joi.number().integer().required(),
            question : Joi.string().required(),
            hasOptions : Joi.boolean().required(),
            optionA : Joi.string().required(),
            optionB : Joi.string().required(),
            optionC : Joi.string().required(),
            optionD : Joi.string().required(),
            optionE : Joi.string().optional(),
            answer: Joi.string().required(),
            time_allowed : Joi.string().required()
        }
    },
    editCategoryEntry : {
        params : {
            id: Joi.number().integer().required()
        },
        body : {
            question : Joi.string().optional(),
            hasOptions : Joi.boolean().optional(),
            optionA : Joi.string().optional(),
            optionB : Joi.string().optional(),
            optionC : Joi.string().optional(),
            optionD : Joi.string().optional(),
            optionE : Joi.string().optional(),
            answer: Joi.string().optional(),
            time_allowed : Joi.string().optional()
        }
    },
    getCategoryEntry : {
        params : {
            id : Joi.number().integer().required()
        }
    }
};