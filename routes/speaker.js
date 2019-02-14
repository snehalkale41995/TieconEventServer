const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  Speaker,
  validateSpeaker,
  generatePassword,
  sendPasswordViaEmail
} = require("../models/speaker");
const { Attendee } = require("../models/attendee");

const _ = require("lodash");
const { AppConfig } = require("../constant/appConfig");


const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    let dt = new Date();
    cb(
      null,
      "IMAGE_" +
        dt.getDate() +
        "-" +
        dt.getMonth() +
        "-" +
        dt.getFullYear() +
        "_" +
        req.body.firstName +
        ".jpg"
    );
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 },
  fileFilter: fileFilter
});


router.get("/", async (req, res) => {
  try {
    const speakers = await Speaker.find().populate("event");
    res.send(speakers);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker)
      return res
        .status(404)
        .send("The speaker with the given ID was not found.");
    res.send(speaker);
  } catch (error) {
    res.send(error.message);
  }
});
///get speakers for a event
router.get("/event/:id", async (req, res) => {
  try {
    const speaker = await Speaker.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!speaker)
      return res
        .status(404)
        .send("The speaker for given event ID was not found.");
    res.send(speaker);
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/new",upload.single("profileImageURL"),async (req, res) => {
  try {
    const userExists = await Attendee.findOne({ email: req.body.email });
    const speakerExists = await Speaker.findOne({ email: req.body.email });
    if (userExists || speakerExists)
      return res.status(404).send("Email Id already Exists");

    const { error } = validateSpeaker(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.file) {
      //console.log(req.body)
      req.body.profileImageURL = AppConfig.serverURL + "/uploads/" + req.file.filename;
    }
    const speaker = new Speaker(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "contact",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "info",
        "profileImageURL",
        "facebookProfileURL",
        "linkedinProfileURL",
        "isEmail",
        "event"
      ])
    );
    let name = req.body.firstName + " " + req.body.lastName;
    const result = await speaker.save();
    await sendPasswordViaEmail(req.body.password, req.body.email, name);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const userExists = await Attendee.findOne({ email: req.body.email });
    const speakerExists = await Speaker.findOne({ email: req.body.email });
    if (userExists || speakerExists)
      return res.status(404).send("Email Id already Exists");

    const { error } = validateSpeaker(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const speaker = new Speaker(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "contact",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "info",
        "profileImageURL",
        "event"
      ])
    );
    let name = req.body.firstName + " " + req.body.lastName;
    const result = await speaker.save();
    await sendPasswordViaEmail(req.body.password, req.body.email, name);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateSpeaker(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "info",
        "profileImageURL",
        "event"
      ]),
      { new: true }
    );

    if (!speaker)
      return res
        .status(404)
        .send("The speaker Information with the given ID was not found.");

    res.send(speaker);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Speaker.findByIdAndRemove(req.params.id);
    if (!result) return res.status(404).send("not found");
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
