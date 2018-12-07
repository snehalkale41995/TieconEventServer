const mongoose = require("mongoose");
const Joi = require("joi");

const RegistrationResponse = mongoose.model(
  "RegistrationResponse",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendee"
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sessions"
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events"
    },
    registrationTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  })
);

function validateRegistrationResponse(registration) {
  const schema = {
    user: Joi.required(),
    session: Joi.required(),
    event: Joi.required(),
    status: Joi.string().required(),
    registrationTime: Joi.date().required()
  };
  return Joi.validate(registration, schema);
}
exports.RegistrationResponse = RegistrationResponse;
exports.validateRegistrationResponse = validateRegistrationResponse;
