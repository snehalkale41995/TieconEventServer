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
      .populate("user")
      .populate("event")
      .populate({
        path: "session",
        populate: [
          {
            path: "speakers",
            model: "Speaker"
          },
          {
            path: "room",
            model: "Rooms"
          }
        ]
      });
    //to populate single child
    // .populate({
    //   path: 'session',
    //   populate: {
    //       path: 'speakers',
    //       model: 'Speaker'
    //   }
    //  })
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
        "user",
        "event",
        "session",
        "registrationTime",
        "status"
      ])
    );
    const result = await registration.save();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateRegistrationResponse(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const registration = await RegistrationResponse.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "user",
        "event",
        "session",
        "registrationTime",
        "status"
      ]),
      { new: true }
    );
    if (!registration)
      return res
        .status(404)
        .send("The response with the given ID was not found.");

    res.send(registration);
  } catch (error) {
    res.send(error.message);
  }
});

//get by eventId
router.get("/eventId/:id", async (req, res) => {
  try {
    const registration = await RegistrationResponse.find()
      .where("event")
      .equals(req.params.id)
      .populate("user")
      .populate("event")
      .populate("session");
    if (!registration)
      return res
        .status(404)
        .send(
          "The registrationResonse  with the given Event ID was not found."
        );
    res.send(registration);
  } catch (error) {
    res.send(error.message);
  }
});

//get by eventId, userId
router.get("/byUser/:eventId/:userId", async (req, res) => {
  try {
    const registration = await RegistrationResponse.find()
      .where("event")
      .equals(req.params.eventId)
      .where("user")
      .equals(req.params.userId)
      .populate("user")
      .populate("event")
      .populate({
        path: "session",
        populate: [
          {
            path: "speakers",
            model: "Speaker"
          },
          {
            path: "room",
            model: "Rooms"
          }
        ]
      });

    if (!registration)
      return res
        .status(404)
        .send(
          "The registrationResonse  with the given Event ID was not found."
        );
    res.send(registration);
  } catch (error) {
    res.send(error.message);
  }
});

//get by eventId, sessionId, userId
router.get("/bySessionUser/:eventId/:sessionId/:userId", async (req, res) => {
  try {
    const registration = await RegistrationResponse.find()
      .where("event")
      .equals(req.params.eventId)
      .where("session")
      .equals(req.params.sessionId)
      .where("user")
      .equals(req.params.userId)
      .populate("user")
      .populate("event")
      .populate("session");
    if (!registration)
      return res
        .status(404)
        .send(
          "The registrationResonse  with the given Event ID was not found."
        );
    res.send(registration);
  } catch (error) {
    res.send(error.message);
  }
});

//get by eventId, sessionId
router.get("/byEventSession/:eventId/:sessionId", async (req, res) => {
  try {
    const registration = await RegistrationResponse.find()
      .where("event")
      .equals(req.params.eventId)
      .where("session")
      .equals(req.params.sessionId)
      .populate("user");
    if (!registration)
      return res
        .status(404)
        .send("The registrationResonse with the given Event ID was not found.");
    res.send(registration);
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
