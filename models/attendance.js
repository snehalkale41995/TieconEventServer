const mongoose = require("mongoose");
const Joi = require("joi");

const Attendance = mongoose.model(
  "Attendance",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events"
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sessions"
    },
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendee"
    },
    scannedBy: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  })
);

function validateAttendance(attendance) {
  const schema = {
    event: Joi.required(),
    session: Joi.required(),
    attendee: Joi.required(),
    scannedBy: Joi.string().required(),
    time: Joi.string().required()
  };
  return Joi.validate(attendance, schema);
}
exports.Attendance = Attendance;
exports.validateAttendance = validateAttendance;
