const mongoose = require("mongoose");
const Joi = require("joi");

const SessionQAnswer = mongoose.model(
  "sessionQAnswer",
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
    question: {
      type: String
    },
    questionAskedTime: {
      type: Date
    },
    voteCount: {
      type: Number
    },
    voters: {
      type: Array
    }
  })
);

function validateSessionQAnswer(sessionQA) {
  const schema = {
    user: Joi.string().allow(""),
    session: Joi.string().allow(""),
    event: Joi.string().allow(""),
    question: Joi.string().allow(""),
    questionAskedTime: Joi.date().allow(""),
    voteCount: Joi.number().allow(""),
    voters: Joi.array().allow("")
  };
  return Joi.validate(sessionQA, schema);
}
exports.SessionQAnswer = SessionQAnswer;
exports.validateSessionQAnswer = validateSessionQAnswer;
