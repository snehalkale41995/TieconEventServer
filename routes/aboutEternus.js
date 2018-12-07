const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { AboutEternus, validateAboutEternus } = require("../models/staticPages");

router.get("/", async (req, res) => {
  try {
    const aboutEternus = await AboutEternus.find();
    res.send(aboutEternus);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var aboutEternusInfo = new AboutEternus(_.pick(req.body, ["info", "url"]));
  try {
    const { error } = validateAboutEternus(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    aboutEternusInfo = await aboutEternusInfo.save();
    res.send(aboutEternusInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateAboutEternus(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const aboutEternusInfo = await AboutEternus.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["info", "url"]),
      { new: true }
    );

    if (!aboutEternusInfo)
      return res
        .status(404)
        .send("The About Eternus Information with the given ID was not found.");

    res.send(aboutEternusInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const aboutEternusInfo = await AboutEternus.findById(req.params.id);
    if (!aboutEternusInfo)
      return res
        .status(404)
        .send("The About Eternus Information with the given ID was not found.");
    res.send(aboutEternusInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const aboutEternusInfo = await AboutEternus.findByIdAndRemove(
      req.params.id
    );
    if (!aboutEternusInfo)
      return res
        .status(404)
        .send("The About Eternus Information with the given ID was not found.");

    res.send(aboutEternusInfo);
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
