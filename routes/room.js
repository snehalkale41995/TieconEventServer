const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Rooms, validateRoom } = require("../models/room");

router.get("/", async (req, res) => {
  try {
    const rooms = await Rooms.find().populate("event");
    res.send(rooms);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var room = new Rooms(
    _.pick(req.body, [
      "event",
      "roomName",
      "capacity",
      //"bufferCapacity",
      //"availableServices"
    ])
  );
  try {
    const { error } = validateRoom(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    room = await room.save();
    res.send(room);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateRoom(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const room = await Rooms.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "event",
        "roomName",
        "capacity",
        //"bufferCapacity",
        //"availableServices"
      ]),
      { new: true }
    );

    if (!room)
      return res.status(404).send("The Room with the given ID was not found.");
    res.send(room);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id).populate("event");
    if (!room)
      return res.status(404).send("The Room with the given ID was not found.");
    res.send(room);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/event/:id", async (req, res) => {
  try {
    const room = await Rooms.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!room)
      return res
        .status(404)
        .send("The Room with the given event ID was not found.");
    res.send(room);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const room = await Rooms.findByIdAndRemove(req.params.id);
    if (!room)
      return res.status(404).send("The Room with the given ID was not found.");
    res.send(room);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
