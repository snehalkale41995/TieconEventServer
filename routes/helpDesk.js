const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Helpdesk, validateHelpDesk } = require("../models/staticPages");

router.get("/", async (req, res) => {
  try {
    const helpDeskInfo = await Helpdesk.find().populate("event");
    res.send(helpDeskInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var helpDeskInfo = new Helpdesk(
    _.pick(req.body, [
      "event",
      "eventSupportEmail",
      "eventSupportContact",
      "techSupportEmail",
      "techSupportContact"
    ])
  );
  try {
    const { error } = validateHelpDesk(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    helpDeskInfo = await helpDeskInfo.save();
    res.send(helpDeskInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateHelpDesk(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const helpDeskInfo = await Helpdesk.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "event",
        "eventSupportEmail",
        "eventSupportContact",
        "techSupportEmail",
        "techSupportContact"
      ]),
      { new: true }
    );

    if (!helpDeskInfo)
      return res
        .status(404)
        .send("The Helpdesk Information with the given ID was not found.");

    res.send(helpDeskInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const helpDeskInfo = await Helpdesk.findById(req.params.id).populate(
      "event"
    );
    if (!helpDeskInfo)
      return res
        .status(404)
        .send("The Helpdesk Information with the given ID was not found.");
    res.send(helpDeskInfo);
  } catch (error) {
    res.send(error.message);
  }
});
//get help desk for event by event id
router.get("/eventId/:id", async (req, res) => {
  try {
    const helpDeskInfo = await Helpdesk.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!helpDeskInfo)
      return res
        .status(404)
        .send(
          "The Helpdesk Information with the given Event ID was not found."
        );
    res.send(helpDeskInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const helpDeskInfo = await Helpdesk.findByIdAndRemove(req.params.id);
    if (!helpDeskInfo)
      return res
        .status(404)
        .send("The Helpdesk Information with the given ID was not found.");
    res.send(helpDeskInfo);
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
