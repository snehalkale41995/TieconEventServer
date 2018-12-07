const express = require("express");
const router = express.Router();
const { SessionTypeList } = require("../models/sessionTypeList");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const sessionTypeList = await SessionTypeList.find();
    res.send(sessionTypeList);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var sessionTypeList = new SessionTypeList(_.pick(req.body, ["sessionTypes"]));
  try {
    sessionTypeList = await sessionTypeList.save();
    res.send(sessionTypeList);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const sessionTypeList = await sessionTypeList.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["sessionTypes"]),
      { new: true }
    );
    if (!sessionTypeList)
      return res
        .status(404)
        .send("The sessionTypeList with the given ID was not found.");
    res.send(sessionTypeList);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const sessionTypeList = await SessionTypeList.findByIdAndRemove(
      req.params.id
    );
    if (!sessionTypeList)
      return res
        .status(404)
        .send("The sessionTypeList with the given ID was not found.");
    res.send(sessionTypeList);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
