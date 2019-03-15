const mongoose = require("mongoose");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const moment = require("moment");
// const bcrypt = require("bcrypt");
const generator = require("generate-password");
const emailExistence = require("email-existence");
const playStoreLink =
  "https://play.google.com/store/apps/details?id=com.eternus.tieconpuneevents";
const appStoreLink =
  "https://itunes.apple.com/es/app/tie-pune-events/id1367365998?mt=8";
const Attendee = mongoose.model(
  "Attendee",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    contact: {
      type: Number,
      required: true,
      minlength: 10
    },
    profileName: String,
    roleName: String,
    attendeeLabel: String,
    attendeeCount: Number,
    briefInfo: String,
    profileImageURL: String,
    facebookProfileURL: String,
    linkedinProfileURL: String,
    twitterProfileURL: String,
    dateCreated : Date,
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    }
  })
);

function validateAttendee(attendee) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().allow(""),
    contact: Joi.number()
      .min(10)
      .required(),
    profileName: Joi.string(),
    roleName: Joi.string(),
    attendeeLabel: Joi.string(),
    attendeeCount: Joi.number(),
    briefInfo: Joi.string().allow(""),
    dateCreated: Joi.date(),
    profileImageURL: Joi.string().allow(""),
    facebookProfileURL: Joi.string().allow(""),
    linkedinProfileURL: Joi.string().allow(""),
    twitterProfileURL: Joi.string().allow(""),
    event: Joi.required()
  };
  return Joi.validate(attendee, schema);
}

function validateAuthUser(user) {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(6)
  };
  return Joi.validate(user, schema);
}

// async function generatePassword() {
//   let password = await generator.generate({
//     length: 6,
//     numbers: true
//   });
//   const salt = await bcrypt.genSalt(10);
//   let hashedPassword = await bcrypt.hash(password, salt);
//   return { password: password, hashedPassword: hashedPassword };
// }

async function validateEmail(email) {
  await emailExistence.check(email, function(error, response) {
    return response;
  });
}

async function sendPasswordViaEmail(password, email, name, eventInfo) {
  let info = "Announcement : Online Networking is now OPEN!";
  let emailSubject = eventInfo.eventName + "  " + info;
  let dateText = "";
  let eventStartDate = new Date(eventInfo.startDate).setHours(0, 0, 0, 0);
  let eventEndDate = new Date(eventInfo.endDate).setHours(0, 0, 0, 0);

  if (eventStartDate != eventEndDate) {
    dateText =
      moment(eventStartDate).format("LL") +
      " " +
      "to" +
      " " +
      moment(eventEndDate).format("LL");
  } else {
    dateText = dateText = moment(eventStartDate).format("LL");
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tiecon.eternus@gmail.com",
      pass: "espl@123"
    }
  });

  var mailOptions = {
    from: "tiecon.eternus@gmail.com",
    to: email,
    subject: emailSubject,
    html:
      "<p>Dear " +
      "<b>" +
      name +
      "</b>" +
      ",</p><span style='color:#000;'>Thank you for registering for" +
      " " +
      eventInfo.eventName +
      ", on " +
      dateText +
      ", at " +
      eventInfo.venue +
      ".</span><br/>" +
      "<span style='color:#000;'>As a registered participant, you now have access to TiE Pune Events Networking Platform that connects all participants before, during and after the event.</span>" +
      "<br/><span style='color:#000;'>Please update your profile with your details and contact.</span> " +
      "<p><b>Login Details</b><br/>" +
      "<span style='color:#000;'>Email :" +
      " " +
      email +
      "</span><br/>" +
      "<span style='color:#000;'>Password :" +
      " " +
      password +
      "</span>" +
      "</p>" +
      "<p><b><span style='color:#000;'>Download Mobile App</b></span><br/>" +
      "<span style='color:#000;'><a href=" +
      appStoreLink +
      "> Available On The App Store </a>" +
      "</span><br/>" +
      "<span style='color:#000;'><a href=" +
      playStoreLink +
      ">Get It On Google Play Store </a>" +
      "</span><br/><br/>" +
      "<p style='color:#000;'>Warm Regards,<br/>Team TieCon</p>"
  };
   await transporter.sendMail(mailOptions);
}

exports.Attendee = Attendee;
exports.validateAttendee = validateAttendee;
exports.validateAuthUser = validateAuthUser;
// exports.generatePassword = generatePassword;
exports.sendPasswordViaEmail = sendPasswordViaEmail;
exports.validateEmail = validateEmail;
