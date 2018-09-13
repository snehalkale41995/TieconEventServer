const mongoose = require("mongoose");
const Joi = require("joi");

const SessionFeedback = mongoose.model(
  "sessionFeedback",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sessions",
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

function validateFeedback(feedback) {
  const schema = {
    event: Joi.string(),
    session: Joi.string(),
    user: Joi.string(),
    formResponse: Joi.array(),
    responseTime: Joi.date()
  };
  return Joi.validate(feedback, schema);
}
exports.SessionFeedback = SessionFeedback;
exports.validateFeedback = validateFeedback;
