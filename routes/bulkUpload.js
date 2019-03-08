const express = require("express");
const router = express.Router();
const {
  Attendee,
  validateAttendee,
  generatePassword,
  sendPasswordViaEmail
} = require("../models/attendee");
const { Speaker } = require("../models/speaker");

const _ = require("lodash");
const { AppConfig } = require("../constant/appConfig");

router.post("/", async (req, res) => {
  var attendeeList = [],
      attendeeObj,
      password,
      attendeeCount= 200;
  try {
    let attendeeList = req.body;
    for (var i = 0; i < attendeeList.length; i++) {
       password = "ES" + Math.floor(1000 + Math.random() * 9000);
       attendeeObj = {...attendeeList[i]};
       attendeeObj.password = password;
       attendeeObj.profileImageURL = "";
       attendeeObj.facebookProfileURL = "";
       attendeeObj.linkedinProfileURL = "";
       attendeeObj.twitterProfileURL = "";
       attendeeObj.isEmail = "true";
       attendeeObj.attendeeLabel = attendeeObj.profileName.substring(0, 3).toUpperCase();
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
          "isEmail",
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
      // res.send(attendeeDetails);
      attendeeCount++;
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;