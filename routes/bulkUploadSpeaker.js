const express = require("express");
const router = express.Router();
const {
  Attendee,
  sendPasswordViaEmail
} = require("../models/attendee");
const { Speaker } = require("../models/speaker");
const { AttendeeCounts} = require("../models/attendeeCount");
const _ = require("lodash");
const { AppConfig } = require("../constant/appConfig");

router.post("/:eventId", async (req, res) => {
  var speakerList = [], speakerLength,
      speakerObj,
      countDetails,
      password,
      speakerCount=0,
      totalCount=0,
      eventId = req.params.eventId
  try {
    speakerList = req.body;
    speakerLength = speakerList.length;
    countDetails = await getAttendeeCount(eventId);
    speakerCount = countDetails.speakerCount + 1;
   
    for (var i = 0; i < speakerList.length; i++) {
       speakerObj = {...speakerList[i]};
       speakerObj.event = eventId;
       speakerObj.password = "ES" + Math.floor(1000 + Math.random() * 9000);
       speakerObj.profileImageURL = "";
       speakerObj.facebookProfileURL = "";
       speakerObj.linkedinProfileURL = "";
       speakerObj.twitterProfileURL = "";
       speakerObj.roleName = "Speaker";
       speakerObj.attendeeLabel = "SPE";
       speakerObj.attendeeCount = speakerCount;
      const speaker = new Speaker(
        _.pick(speakerObj, [
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
          "twitterProfileURL",
          "event"
        ])
      );
      let name = speakerObj.firstName + " " + speakerObj.lastName;
      const result = await speaker.save();
      const speakerDetails = await Speaker.findById(result._id).populate(
        "event"
      );
      await sendPasswordViaEmail(
        speakerObj.password,
        speakerObj.email,
        name,
        speakerDetails.event
      );
      speakerCount++;
    }
     await updateAttendeeCount(eventId, speakerLength, countDetails);
    //  res.json({ success : true });
    res.status(200).json({success : true});
  } catch (error) {
   // res.send(error.message);
    res.status(500).json({success: false});
  }
});

 async function getAttendeeCount (eventId){
   try {
    const count = await AttendeeCounts.find()
      .where("event")
      .equals(eventId);
      return count[0];
  } catch (error) {
    res.send(error.message);
  }
}

 async function updateAttendeeCount (eventId, speakerLength, countDetails ){
   var speakerCount, totalCount, speakerObj = {};
    try {
    speakerObj = {
    speakerCount : countDetails.speakerCount + speakerLength,
    totalCount : countDetails.totalCount + speakerLength
  }
    const count = await AttendeeCounts.findByIdAndUpdate(
      countDetails._id,
      _.pick(speakerObj, [
        "speakerCount",
        "totalCount"
      ]),
      { new: true }
    );
  } catch (error) {
  // console.log("errrr",error)
  }
}

module.exports = router;