const express = require("express");
const router = express.Router();
const { UserProfiles, validateProfile } = require("../models/userProfile");

router.get("/", async (req, res) => {
  try {
    const userProfiles = await UserProfiles.find().populate("event");
    res.send(userProfiles);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var userProfile = new UserProfiles({
    profileName: req.body.profileName,
    event: req.body.event
  });
  try {
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    userProfile = await userProfile.save();
    res.send(userProfile);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userProfile = await UserProfiles.findByIdAndUpdate(
      req.params.id,
      { profileName: req.body.profileName, event: req.body.event },
      { new: true }
    );

    if (!userProfile)
      return res
        .status(404)
        .send("The Profile with the given ID was not found.");
    res.send(userProfile);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userProfile = await UserProfiles.findById(req.params.id);
    if (!userProfile)
      return res
        .status(404)
        .send("The Profile with the given ID was not found.");
    res.send(userProfile);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userProfile = await UserProfiles.findByIdAndRemove(req.params.id);
    if (!userProfile)
      return res
        .status(404)
        .send("The Profile with the given ID was not found.");
    res.send(userProfile);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
