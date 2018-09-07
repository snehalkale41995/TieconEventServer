const mongoose = require("mongoose");
const Joi = require("joi");

const HomeQueResponse = mongoose.model(
  "homeQuestionResponse",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendee"
    },
    formResponse: {
      type: Array
    },
    responseTime: {
      type: Date
    }
  })
);

function validateResponse(formResponse) {
  const schema = {
    event: Joi.string(),
    user: Joi.string(),
    formResponse: Joi.array(),
    responseTime: Joi.date()
  };
  return Joi.validate(formResponse, schema);
}
exports.HomeQueResponse = HomeQueResponse;
exports.validateResponse = validateResponse;
