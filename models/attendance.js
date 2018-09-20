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
    userId: {
      type: String
    },
    userType: {
      type: String
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
    userId: Joi.required(),
    userType: Joi.allow(""),
    scannedBy: Joi.string().required(),
    time: Joi.string().required()
  };
  return Joi.validate(attendance, schema);
}
exports.Attendance = Attendance;
exports.validateAttendance = validateAttendance;
