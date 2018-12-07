const express = require("express");
const router = express.Router();
const { ProfileList } = require("../models/profileList");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const profileList = await ProfileList.find();
    res.send(profileList);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var profileList = new ProfileList(_.pick(req.body, ["profiles"]));
  try {
    profileList = await profileList.save();
    res.send(profileList);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const profileList = await profileList.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["profiles"]),
      { new: true }
    );
    if (!profileList)
      return res
        .status(404)
        .send("The profileList with the given ID was not found.");
    res.send(profileList);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const profileList = await ProfileList.findByIdAndRemove(req.params.id);
    if (!profileList)
      return res
        .status(404)
        .send("The profilelist with the given ID was not found.");
    res.send(profileList);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
