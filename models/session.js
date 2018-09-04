const mongoose = require("mongoose");
const Joi = require("joi");

const Sessions = mongoose.model(
  "Sessions",
  new mongoose.Schema({
    sessionName: {
      type: String,
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    speakers: {
      type: Array
      //required : true
    },
    volunteers: {
      type: Array
      //required : true
    },
    room: String,
    description: String,
    sessionType: String,
    sessionCapacity: Number,
    startTime: Date,
    endTime: Date,
    isBreak: Boolean,
    isRegistrationRequired: Boolean
  })
);

function validateSession(session) {
  const schema = {
    sessionName: Joi.string().required(),
    event: Joi.required(),
    speakers: Joi.array().allow(""),
    volunteers: Joi.array().allow(""),
    room: Joi.string().allow(""),
    description: Joi.string().allow(""),
    sessionType: Joi.string(),
    sessionCapacity: Joi.number().allow(""),
    startTime: Joi.date(),
    endTime: Joi.date(),
    isBreak: Joi.boolean(),
    isRegistrationRequired: Joi.boolean().allow("")
  };
  return Joi.validate(session, schema);
}
exports.Sessions = Sessions;
exports.validateSession = validateSession;
