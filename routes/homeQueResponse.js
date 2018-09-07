const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  HomeQueResponse,
  validateResponse
} = require("../models/homeQueResponse");

router.get("/", async (req, res) => {
  try {
    const QueResponseInfo = await HomeQueResponse.find().populate("event").populate("user");
    res.send(QueResponseInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var QueResponseInfo = new HomeQueResponse(
    _.pick(req.body, ["event", "user", "formResponse", "responseTime"])
  );
  try {
    const { error } = validateResponse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    QueResponseInfo = await QueResponseInfo.save();
    res.send(QueResponseInfo);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/eventId/:id", async (req, res) => {
  try {
    const QueResponseInfo = await HomeQueResponse.find()
      .where("event")
      .equals(req.params.id)
      .populate("event")
      .populate("user");
    if (!QueResponseInfo)
      return res
        .status(404)
        .send(
          "The HomeQueResponse Information with the given Event ID was not found."
        );
    res.send(QueResponseInfo);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
