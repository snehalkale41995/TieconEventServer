const mongoose = require("mongoose");
const Joi = require("joi");

const AttendeeCounts = mongoose.model(
  "AteendeeCounts",
  new mongoose.Schema({
    attendeeCount: {
      type: Number,
      required: true
    },
    speakerCount: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    }
  })
);

function validateCount(count) {
  const schema = {
    attendeeCount: Joi.required(),
    speakerCount: Joi.required(),
    totalCount: Joi.required(),
    event: Joi.required()
  };
  return Joi.validate(count, schema);
}
exports.AttendeeCounts = AttendeeCounts;
exports.validateCount = validateCount;
