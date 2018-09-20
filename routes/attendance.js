const express = require("express");
const router = express.Router();
const { Attendance, validateAttendance } = require("../models/attendance");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const result = await Attendance.find()
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
      _.pick(req.body, [
        "userId",
        "userType",
        "event",
        "session",
        "scannedBy",
        "time"
      ])
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

//get by eventId, sessionId
router.get("/bySessionEvent/:eventId/:sessionId", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .where("event")
      .equals(req.params.eventId)
      .where("session")
      .equals(req.params.sessionId);
    if (!attendance)
      return res
        .status(404)
        .send("The attendance with the given session ID was not found.");
    res.send(attendance);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
