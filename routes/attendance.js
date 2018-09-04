const express = require("express");
const router = express.Router();
const { Attendance, validateAttendance } = require("../models/attendance");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const result = await Attendance.find()
      .populate("attendee", "firstName lastName")
      .populate("event", "eventName")
      .populate("session", "sessionName");
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateAttendance(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const attendance = new Attendance(
      _.pick(req.body, ["attendee", "event", "session", "scannedBy", "time"])
    );
    const result = await attendance.save();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Attendance.findByIdAndRemove(req.params.id);
    if (!result) return res.status(404).send("not found");
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
