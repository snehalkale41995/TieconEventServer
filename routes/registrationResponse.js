const express = require("express");
const router = express.Router();
const {
  RegistrationResponse,
  validateRegistrationResponse
} = require("../models/registrationResponse");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const registrations = await RegistrationResponse.find()
      .populate("attendee", "firstName lastName")
      .populate("event", "eventName")
      .populate("session", "sessionName");
    res.send(registrations);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateRegistrationResponse(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const registration = new RegistrationResponse(
      _.pick(req.body, [
        "attendee",
        "event",
        "session",
        "registrationtime",
        "status"
      ])
    );
    const result = await registration.save();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await RegistrationResponse.findByIdAndRemove(req.params.id);
    if (!result) return res.status(404).send("not found");
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
