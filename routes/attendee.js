const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  Attendee,
  validateAttendee,
  generatePassword,
  sendPasswordViaEmail
} = require("../models/attendee");
const { Speaker } = require("../models/speaker");

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
    cb(null, "IMAGE_" + req.body.email + ".jpg");
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 4 },
  fileFilter: fileFilter
});

router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find().populate("event");
    res.send(attendees);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee)
      return res
        .status(404)
        .send("The attendee with the given ID was not found.");
    res.send(attendee);
  } catch (error) {
    res.send(error.message);
  }
});
///get attendees for a event
router.get("/event/:id", async (req, res) => {
  try {
    const attendee = await Attendee.find()
      .where("event")
      .equals(req.params.id)
      .populate("event");
    if (!attendee)
      return res
        .status(404)
        .send("The attendee for given event ID was not found.");
    res.send(attendee);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const userExists = await Attendee.findOne({ email: req.body.email });
    const speakerExists = await Speaker.findOne({ email: req.body.email });
    if (userExists || speakerExists)
      return res.status(400).send("Email Id already Exists");
    // var password = "ES" + Math.floor(1000 + Math.random() * 9000);
    const { error } = validateAttendee(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const attendee = new Attendee(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "contact",
        "profileName",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "event"
      ])
    );
    let name = req.body.firstName + " " + req.body.lastName;
    const result = await attendee.save();

    await sendPasswordViaEmail(req.body.password, req.body.email, name);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

// To send email only
router.post("/inform", async (req, res) => {
  try {
    if (req.body.password && req.body.email) {
      let name = req.body.firstName + " " + req.body.lastName;
      await sendPasswordViaEmail(req.body.password, req.body.email, name);
      const attendee = await Attendee.findByIdAndUpdate(
        req.body._id,
        _.pick(req.body, [
          "firstName",
          "lastName",
          "email",
          "contact",
          "profileName",
          "roleName",
          "attendeeLabel",
          "attendeeCount",
          "briefInfo",
          "profileImageURL",
          "facebookProfileURL",
          "linkedinProfileURL",
          "twitterProfileURL",
          "isEmail",
          "event"
        ]),
        { new: true }
      );
      if (!attendee)
        return res
          .status(404)
          .send("The attendee Information with the given ID was not found.");

      //res.send(attendee);
      res.status(200).send(attendee);
    } else {
      res.status(404).send("Email not provided..");
    }
  } catch (error) {
    res.send(error.message);
  }
});

//post attendee data
router.post("/new", upload.single("profileImageURL"), async (req, res) => {
  try {
    const userExists = await Attendee.findOne({ email: req.body.email });
    const speakerExists = await Speaker.findOne({ email: req.body.email });
    if (userExists || speakerExists)
      return res.status(400).send("Email Id already Exists");
    // var password = "ES" + Math.floor(1000 + Math.random() * 9000);
    const { error } = validateAttendee(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    if (req.file) {
      req.body.profileImageURL =
        AppConfig.serverURL + "/uploads/" + req.file.filename;
    } else {
      req.body.profileImageURL = null;
    }

    const attendee = new Attendee(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "contact",
        "profileName",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "facebookProfileURL",
        "linkedinProfileURL",
        "twitterProfileURL",
        "isEmail",
        "event"
      ])
    );
    let name = req.body.firstName + " " + req.body.lastName;
    const result = await attendee.save();
    const attendeeDetails = await Attendee.findById(result._id).populate(
      "event"
    );
    await sendPasswordViaEmail(
      req.body.password,
      req.body.email,
      name,
      attendeeDetails.event
    );
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/new/:id", upload.single("profileImageURL"), async (req, res) => {
  try {
    const { error } = validateAttendee(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    if (req.file) {
      req.body.profileImageURL =
        AppConfig.serverURL + "/uploads/" + req.file.filename;
    } else if (req.body.profileImageURL === "") {
      req.body.profileImageURL = null;
    }

    const attendee = await Attendee.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "profileName",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "facebookProfileURL",
        "linkedinProfileURL",
        "twitterProfileURL",
        "event"
      ]),
      { new: true }
    );

    if (!attendee)
      return res
        .status(404)
        .send("The attendee Information with the given ID was not found.");

    res.send(attendee);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { error } = validateAttendee(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const attendee = await Attendee.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "profileName",
        "roleName",
        "attendeeLabel",
        "attendeeCount",
        "briefInfo",
        "profileImageURL",
        "event"
      ]),
      { new: true }
    );

    if (!attendee)
      return res
        .status(404)
        .send("The attendee Information with the given ID was not found.");

    res.send(attendee);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Attendee.findById(req.params.id);
    if (!result) return res.status(404).send("not found");
    const isAdmin = result.roleName === "Admin";
    if (isAdmin) {
      return res.status(404).send("Admin Cannot be deleted");
    } else {
      const deleteResult = await Attendee.findByIdAndRemove(req.params.id);
      res.send(deleteResult);
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
