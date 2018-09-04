const express = require("express");
const router = express.Router();

const {
  Attendee,
  validateAttendee,
  generatePassword,
  sendPasswordViaEmail
} = require("../models/attendee");
const { Speaker } = require("../models/speaker");

const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find().populate("event");
    res.send(attendees);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee)
      return res
        .status(404)
        .send("The attendee with the given ID was not found.");
    res.send(attendee);
  } catch (error) {
    res.send(error.message);
  }
});
///get attendees for a event
router.get("/event/:id", async (req, res) => {
  try {
    const attendee = await Attendee.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!attendee)
      return res
        .status(404)
        .send("The attendee for given event ID was not found.");
    res.send(attendee);
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
    const { error } = validateAttendee(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    req.body.password = hashedPassword;
    //req.body.password = password;
    const attendee = new Attendee(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "contact",
        "profiles",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "event"
      ])
    );
    let name = req.body.firstName + " " + req.body.lastName;
    const result = await attendee.save();
    await sendPasswordViaEmail(password, req.body.email, name);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateAttendee(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const attendee = await Attendee.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "profiles",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "event"
      ]),
      { new: true }
    );

    if (!attendee)
      return res
        .status(404)
        .send("The attendee Information with the given ID was not found.");

    res.send(attendee);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Attendee.findById(req.params.id);
    if (!result) return res.status(404).send("not found");
    const isAdmin = result.roleName === "Admin";
    if (isAdmin) {
      return res.status(404).send("Admin Cannot be deleted");
    } else {
      const deleteResult = await Attendee.findByIdAndRemove(req.params.id);
      res.send(deleteResult);
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
