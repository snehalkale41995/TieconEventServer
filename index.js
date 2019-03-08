const express = require("express");
const app = express();
const mongoose = require("mongoose");
var path = require("path");

const attendee = require("./routes/attendee");
const speaker = require("./routes/speaker");
const attendeeCount = require("./routes/attendeeCount");
const authenticate = require("./routes/authentication");
const attendance = require("./routes/attendance");
const event = require("./routes/event");
const session = require("./routes/session");
const sponsor = require("./routes/sponsor");
const room = require("./routes/room");
const questionForms = require("./routes/questionForms");
const aboutUs = require("./routes/aboutUs");
const aboutEternus = require("./routes/aboutEternus");
const helpDesk = require("./routes/helpDesk");
const location = require("./routes/location");
const sessionTypeList = require("./routes/sessionTypeList");
const profileList = require("./routes/profileList");
const homeQueResponse = require("./routes/homeQueResponse");
const registrationResponse = require("./routes/registrationResponse");
const sessionFeedback = require("./routes/sessionFeedback");
const sessionQAnswer = require("./routes/sessionQAnswer");
const appTheme = require("./routes/appTheme");
const bulkUploadAttendee = require("./routes/bulkUploadAttendee");
const bulkUploadSpeaker = require("./routes/bulkUploadSpeaker");
const cors = require("cors");

var public = path.join(__dirname, "public");
app.get("/", function(req, res) {
  res.sendFile(path.join(public, "index.html"));
});
app.use("/", express.static(public));

mongoose
  .connect(
    "mongodb://snehal.patil:espl123@ds227171.mlab.com:27171/eventmanagementapp"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error(err));

app.use(express.json());
app.use(cors());
app.use("/api/authenticate", authenticate);
app.use("/api/event", event);
app.use("/api/session", session);
app.use("/api/registrationResponse", registrationResponse);
app.use("/api/attendee", attendee);
app.use("/api/speaker", speaker);
app.use("/api/attendeeCount", attendeeCount);
app.use("/api/attendance", attendance);
app.use("/api/sponsor", sponsor);
app.use("/api/room", room);
app.use("/api/questionForms", questionForms);
app.use("/api/aboutUs", aboutUs);
app.use("/api/aboutEternus", aboutEternus);
app.use("/api/location", location);
app.use("/api/helpdesk", helpDesk);
app.use("/api/sessionTypeList", sessionTypeList);
app.use("/api/profileList", profileList);
app.use("/api/homeQueResponse", homeQueResponse);
app.use("/api/sessionFeedback", sessionFeedback);
app.use("/api/sessionQAnswer", sessionQAnswer);
app.use("/api/appTheme", appTheme);
app.use("/api/bulkUploadAttendee", bulkUploadAttendee);
app.use("/api/bulkUploadSpeaker", bulkUploadSpeaker);


const port = process.env.PORT || 3010;

app.listen(port, () => console.log(`Listening on port ${port}...`));
