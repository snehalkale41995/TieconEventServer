const mongoose = require("mongoose");
const Joi = require("joi");

const RegistrationResponse = mongoose.model(
  "RegistrationResponse",
  new mongoose.Schema({
    attendee: {
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
    registrationtime: {
      type: String,
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
    attendee: Joi.required(),
    session: Joi.required(),
    event: Joi.required(),
    status: Joi.string().required(),
    registrationtime: Joi.string().required()
  };
  return Joi.validate(registration, schema);
}
exports.RegistrationResponse = RegistrationResponse;
exports.validateRegistrationResponse = validateRegistrationResponse;
