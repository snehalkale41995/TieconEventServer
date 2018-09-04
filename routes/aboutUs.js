const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { AboutUs, validateAboutUs } = require("../models/staticPages");

router.get("/", async (req, res) => {
  try {
    const aboutInfo = await AboutUs.find().populate("event");
    res.send(aboutInfo);
  } catch (error) {
    res.send(error.message);
  }
});

//get help desk for event by event id
router.get("/eventId/:id", async (req, res) => {
  try {
    const aboutInfo = await AboutUs.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!aboutInfo)
      return res
        .status(404)
        .send("The AboutUs Information with the given Event ID was not found.");
    res.send(aboutInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var aboutUsInfo = new AboutUs(_.pick(req.body, ["info", "url", "event"]));
  try {
    const { error } = validateAboutUs(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    aboutUsInfo = await aboutUsInfo.save();
    res.send(aboutUsInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateAboutUs(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const aboutUsInfo = await AboutUs.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["info", "url", "event"]),
      { new: true }
    );

    if (!aboutUsInfo)
      return res
        .status(404)
        .send("The About Us Information with the given ID was not found.");

    res.send(aboutUsInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const aboutUsInfo = await AboutUs.findById(req.params.id).populate("event");
    if (!aboutUsInfo)
      return res
        .status(404)
        .send("The About Us Information with the given ID was not found.");
    res.send(aboutUsInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const aboutUsInfo = await AboutUs.findByIdAndRemove(req.params.id);
    if (!aboutUsInfo)
      return res
        .status(404)
        .send("The About Us Information with the given ID was not found.");

    res.send(aboutUsInfo);
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
