const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Sessions, validateSession } = require("../models/session");

router.get("/", async (req, res) => {
  try {
    const sessions = await Sessions.find().populate("event");
    res.send(sessions);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var session = new Sessions(req.body);

  try {
    const { error } = validateSession(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    session = await session.save();
    res.send(session);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateSession(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    const session = await Sessions.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!session)
      return res
        .status(404)
        .send("The Session with the given ID was not found.");
    res.send(session);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const session = await Sessions.findById(req.params.id);

    if (!session)
      return res
        .status(404)
        .send("The Session with the given ID was not found.");
    res.send(session);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const session = await Sessions.findByIdAndRemove(req.params.id);

    if (!session)
      return res
        .status(404)
        .send("The Session with the given ID was not found.");
    res.send(session);
  } catch (error) {
    res.send(error.message);
  }
});

//get Sessions list by event id

router.get("/getSessions/:id", async (req, res) => {
  try {
    const sessionList = await Sessions.find()
      .where("event")
      .equals(req.params.id)
      .populate("event")
      .populate("room")
      .populate("speakers");
    res.send(sessionList);
  } catch (error) {
    res.send(error.message);
  }
});

//get session list by eventId and speakerId
router.get("/getSessions/:eventId/:speakerId", async (req, res) => {
  try {
    const sessionList = await Sessions.find()
      .where("event")
      .equals(req.params.eventId)
      .where("speakers")
      .equals(req.params.speakerId)
      .populate("event")
      .populate("room")
      .populate("speakers");
    res.send(sessionList);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;

