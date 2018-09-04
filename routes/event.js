const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Events, validateEvent } = require("../models/event");
const { Sessions } = require("../models/session");
const { AttendeeCounts } = require("../models/attendeeCount");
const { Rooms } = require("../models/room");
const { Attendee } = require("../models/attendee");
const {
  Helpdesk,
  EventLocation,
  AboutEternus,
  AboutUs
} = require("../models/staticPages");
const { Speaker } = require("../models/speaker");
const { Sponsors } = require("../models/sponsor");
const { UserProfiles } = require("../models/userProfile");
const { QuestionForms } = require("../models/questionForms");
const { RegistrationResponse } = require("../models/registrationResponse");

router.get("/", async (req, res) => {
  try {
    const events = await Events.find().sort({ startDate: "descending" });
    res.send(events);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var event = new Events(
    _.pick(req.body, [
      "eventName",
      "venue",
      "description",
      "startDate",
      "endDate",
      "eventLogo"
    ])
  );
  try {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    event = await event.save();
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const event = await Events.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "eventName",
        "venue",
        "description",
        "startDate",
        "endDate",
        "eventLogo"
      ]),
      { new: true }
    );
    if (!event)
      return res.status(404).send("The Event with the given ID was not found.");
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event)
      return res.status(404).send("The Event with the given ID was not found.");
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const event = await Events.findByIdAndRemove(req.params.id);
    //await Events.find().where('event').equals(req.params.id).remove();
    if (!event)
      return res.status(404).send("The Event with the given ID was not found.");
    //delete from following collections
    await Sessions.deleteMany({ event: req.params.id });
    await Rooms.deleteMany({ event: req.params.id }); // rooms ,
    await AboutUs.deleteMany({ event: req.params.id }); // aboutUS
    await Helpdesk.deleteMany({ event: req.params.id }); // helpDesk ,attendance
    await Attendee.deleteMany({
      event: req.params.id,
      roleName: { $ne: "Admin" }
    }); //, attendee,
    await EventLocation.deleteMany({ event: req.params.id }); //location
    await QuestionForms.deleteMany({ event: req.params.id }); // , questionForms ,
    await Speaker.deleteMany({ event: req.params.id }); // speakers ,
    await Sponsors.deleteMany({ event: req.params.id }); //, ,sponsors
    await UserProfiles.deleteMany({ event: req.params.id }); // profiles
    await RegistrationResponse.deleteMany({ event: req.params.id }); // registrationResponse  ,
    await AttendeeCounts.deleteMany({ event: req.params.id });
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
