const express = require("express");
const router = express.Router();
const {
  Speaker,
  validateSpeaker,
  generatePassword,
  sendPasswordViaEmail
} = require("../models/speaker");
const { Attendee } = require("../models/attendee");

const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const speakers = await Speaker.find().populate("event");
    res.send(speakers);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker)
      return res
        .status(404)
        .send("The speaker with the given ID was not found.");
    res.send(speaker);
  } catch (error) {
    res.send(error.message);
  }
});
///get speakers for a event
router.get("/event/:id", async (req, res) => {
  try {
    const speaker = await Speaker.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!speaker)
      return res
        .status(404)
        .send("The speaker for given event ID was not found.");
    res.send(speaker);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const userExists = await Attendee.findOne({ email: req.body.email });
    const speakerExists = await Speaker.findOne({ email: req.body.email });
    if (userExists || speakerExists)
      return res.status(404).send("User Already Exists");
    const { password, hashedPassword } = await generatePassword();
    const { error } = validateSpeaker(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    req.body.password = hashedPassword;
    //req.body.password = password;
    const speaker = new Speaker(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "contact",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "event"
      ])
    );
    let name = req.body.firstName + " " + req.body.lastName;
    const result = await speaker.save();
    await sendPasswordViaEmail(password, req.body.email, name);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateSpeaker(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "event"
      ]),
      { new: true }
    );

    if (!speaker)
      return res
        .status(404)
        .send("The speaker Information with the given ID was not found.");

    res.send(speaker);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Speaker.findByIdAndRemove(req.params.id);
    if (!result) return res.status(404).send("not found");
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
