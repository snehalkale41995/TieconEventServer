const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  SessionQAnswer,
  validateSessionQAnswer
} = require("../models/sessionQAnswer");

router.get("/", async (req, res) => {
  try {
    const SessionQAnswerInfo = await SessionQAnswer.find().populate("user");
    res.send(SessionQAnswerInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var SessionQAnswerInfo = new SessionQAnswer(req.body);
  try {
    const { error } = validateSessionQAnswer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    SessionQAnswerInfo = await SessionQAnswerInfo.save();
    res.send(SessionQAnswerInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateSessionQAnswer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const SessionQAnswerInfo = await SessionQAnswer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!SessionQAnswerInfo)
      return res
        .status(404)
        .send("The SessionQAnswerInfo with the given ID was not found.");
    res.send(SessionQAnswerInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/eventId/:id", async (req, res) => {
  try {
    const SessionQAnswerInfo = await SessionQAnswer.find()
      .where("event")
      .equals(req.params.id)
      .populate("user");

    if (!SessionQAnswerInfo)
      return res
        .status(404)
        .send(
          "The SessionQAnswer Information with the given Event ID was not found."
        );
    res.send(SessionQAnswerInfo);
  } catch (error) {
    res.send(error.message);
  }
});

//get by eventId, sessionId, userId
router.get("/bySessionUser/:eventId/:sessionId/:userId", async (req, res) => {
  try {
    const SessionQAnswerInfo = await SessionQAnswer.find()
      .where("event")
      .equals(req.params.eventId)
      .where("session")
      .equals(req.params.sessionId)
      .where("user")
      .equals(req.params.userId)
      .populate("user");

    if (!SessionQAnswerInfo)
      return res
        .status(404)
        .send("The SessionQAnswerInfo with the given Event ID was not found.");
    res.send(SessionQAnswerInfo);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
