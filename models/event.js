const mongoose = require("mongoose");
const Joi = require("joi");

const Events = mongoose.model(
  "Events",
  new mongoose.Schema({
    eventName: {
      type: String,
      required: true
    },
    venue: String,
    description: String,
    startDate: Date,
    endDate: Date,
    eventLogo: String
  })
);

function validateEvent(event) {
  const schema = {
    eventName: Joi.string().required(),
    venue: Joi.string(),
    description: Joi.string().allow(""),
    startDate: Joi.date(),
    endDate: Joi.date(),
    eventLogo: Joi.string().allow("")
  };
  return Joi.validate(event, schema);
}
exports.Events = Events;
exports.validateEvent = validateEvent;
