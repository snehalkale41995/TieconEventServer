const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  SessionFeedback,
  validateFeedback
} = require("../models/sessionFeedback");

router.get("/", async (req, res) => {
  try {
    const SessionFeedbackInfo = await SessionFeedback.find()
      .populate("event")
      .populate("user");
    res.send(SessionFeedbackInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var SessionFeedbackInfo = new SessionFeedback(
    _.pick(req.body, [
      "event",
      "session",
      "user",
      "formResponse",
      "responseTime"
    ])
  );
  try {
    const { error } = validateFeedback(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    SessionFeedbackInfo = await SessionFeedbackInfo.save();
    res.send(SessionFeedbackInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/eventId/:id", async (req, res) => {
  try {
    const SessionFeedbackInfo = await SessionFeedback.find()
      .where("event")
      .equals(req.params.id)
      .populate("event")
      .populate("session")
      .populate("user");
    if (!SessionFeedbackInfo)
      return res
        .status(404)
        .send(
          "The SessionFeedback Information with the given Event ID was not found."
        );
    res.send(SessionFeedbackInfo);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
