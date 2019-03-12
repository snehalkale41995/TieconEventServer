const express = require("express");
const router = express.Router();
const {
  Attendee,
  validateAttendee,
  generatePassword,
  sendPasswordViaEmail
} = require("../models/attendee");
const { Speaker } = require("../models/speaker");
const { AttendeeCounts } = require("../models/attendeeCount");
const _ = require("lodash");
const { AppConfig } = require("../constant/appConfig");

router.post("/post/:eventId", async (req, res) => {
  var attendeeList = [],
    attendeeLength,
    attendeeObj,
    countDetails,
    password,
    attendeeCount = 0,
    totalCount = 0,
    eventId = req.params.eventId;
  try {
    attendeeList = req.body;
    attendeeLength = attendeeList.length;
    countDetails = await getAttendeeCount(eventId);
    attendeeCount = countDetails.attendeeCount + 1;

    for (var i = 0; i < attendeeList.length; i++) {
      attendeeObj = { ...attendeeList[i] };
      attendeeObj.event = eventId;
      attendeeObj.password = "ES" + Math.floor(1000 + Math.random() * 9000);
      attendeeObj.profileImageURL = "";
      attendeeObj.facebookProfileURL = "";
      attendeeObj.linkedinProfileURL = "";
      attendeeObj.twitterProfileURL = "";
      attendeeObj.isEmail = "true";
      attendeeObj.roleName = attendeeObj.profileName;
      attendeeObj.attendeeLabel = attendeeObj.profileName
        .substring(0, 3)
        .toUpperCase();
      attendeeObj.attendeeCount = attendeeCount;
      const attendee = new Attendee(
        _.pick(attendeeObj, [
          "firstName",
          "lastName",
          "email",
          "event",
          "contact",
          "profileName",
          "roleName",
          "briefInfo",
          "password",
          "attendeeLabel",
          "attendeeCount",
          "profileImageURL",
          "facebookProfileURL",
          "linkedinProfileURL",
          "twitterProfileURL",
          "isEmail"
        ])
      );
      let name = attendeeObj.firstName + " " + attendeeObj.lastName;
      const result = await attendee.save();
      const attendeeDetails = await Attendee.findById(result._id).populate(
        "event"
      );
      await sendPasswordViaEmail(
        attendeeObj.password,
        attendeeObj.email,
        name,
        attendeeDetails.event
      );
      attendeeCount++;
    }
    await updateAttendeeCount(eventId, attendeeLength, countDetails);
    //  res.json({ success : true });
    res.status(200).json({ success: true });
  } catch (error) {
    // res.send(error.message);
    res.status(500).json({ success: false });
  }
});

async function getAttendeeCount(eventId) {
  try {
    const count = await AttendeeCounts.find()
      .where("event")
      .equals(eventId);
    return count[0];
  } catch (error) {
    res.send(error.message);
  }
}

async function updateAttendeeCount(eventId, attendeeLength, countDetails) {
  var attendeeCount,
    totalCount,
    attendeeObj = {};
  try {
    attendeeObj = {
      attendeeCount: countDetails.attendeeCount + attendeeLength,
      totalCount: countDetails.totalCount + attendeeLength
    };
    const count = await AttendeeCounts.findByIdAndUpdate(
      countDetails._id,
      _.pick(attendeeObj, ["attendeeCount", "totalCount"]),
      { new: true }
    );
  } catch (error) {
    // console.log("errrr",error)
  }
}

router.post("/validate", async (req, res) => {
  try {
    let attendeeList = req.body,
      userList = [];
    attendeeLength = attendeeList.length;
    let errorFlag = false;
    for (var i = 0; i < attendeeList.length; i++) {
      attendee = { ...attendeeList[i] };
      let errorMessage = "";
      let userExists = await Attendee.findOne({ email: attendee.email });
      let speakerExists = await Speaker.findOne({ email: attendee.email });
      if (userExists || speakerExists) {
        errorMessage += "emailId already exists" + " ";
        errorFlag = true;
      }
      if (attendee.contact.toString().length != 10) {
        errorMessage += ", Invalid contact" + " ";
        errorFlag = true;
      }
      if (errorFlag === true) attendee.errorMessage = errorMessage;
      else attendee.errorMessage = "";

      userList.push(attendee);
    }
    if (errorFlag) res.status(500).json({ success: false, userList: userList });
    else res.status(200).json({ success: true, userList: userList });
  } catch (error) {
      res.status(500).json({success : false, userList: userList });
  }
});

module.exports = router;
