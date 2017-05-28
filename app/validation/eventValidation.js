/**
 * Created by barthclem on 5/16/17.
 */
let Joi = require('joi');

module.exports = {
  createEvent: {
      body: {
          title: Joi.string().regex(/[A-Za-z]\s(\w)+/).required(),
          scheduled_at: Joi.date().required(),
          organizer_id: Joi.number().integer().required()
      }
  },
    editEvent: {
      body: {
          title: Joi.string().regex(/[A-Za-z]\s(\w)+/).optional(),
          scheduled_at: Joi.date().optional(),
          organizer_id: Joi.number().integer().optional()
      }
    },
    getEvent: {
      params: {
          id: Joi.number().integer().optional()
      }
    }
};