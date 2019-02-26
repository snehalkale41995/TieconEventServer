const mongoose = require("mongoose");
const Joi = require("joi");
const nodemailer = require("nodemailer");
// const bcrypt = require("bcrypt");
const generator = require("generate-password");
const emailExistence = require("email-existence");
const playStoreLink =
  "https://play.google.com/store/apps/details?id=com.eternus.tieconpuneevents";
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
    isEmail: false,

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
    profileImageURL: Joi.string().allow(""),
    facebookProfileURL: Joi.string().allow(""),
    linkedinProfileURL: Joi.string().allow(""),
    twitterProfileURL: Joi.string().allow(""),
    isEmail: Joi.boolean(),
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
    subject:
      eventInfo.eventName +" "+Announcement: Online Networking is now OPEN!",
    html:
      "<p>Dear " +
      "<b>"+name+"</b>"+
      ",</p><span style='color:#000;'>Thank you for registering for"+" "+
      eventInfo.eventName+
      ", at " +
      eventInfo.venue+".</span><br/>"+
      "<span style='color:#000;'>As a registered participant, you now have access to TIEPUNE Networking Platform that connects all participants before, during and after the event.</span>" +
      "<br/><span style='color:#000;'>Please update your profile with your details and contact.</span> " +
      "<p><b>Login Details</b><br/>" +
      "<span style='color:#000;'>Email :" + " "+
       email + "</span><br/>"+
      "<span style='color:#000;'>Password :" + " "+
      password + "</span>" +
      "</p>" +
      "<p><b>Download Mobile App</b>" +
      "<br/><span><a href=" +
      playStoreLink +
      "> <img style='width:120px;height:50px;' src='" +
      "../assets/google-play.png" +
      "'/> </a> <span>"
  };

  transporter.sendMail(mailOptions);
}

exports.Attendee = Attendee;
exports.validateAttendee = validateAttendee;
exports.validateAuthUser = validateAuthUser;
// exports.generatePassword = generatePassword;
exports.sendPasswordViaEmail = sendPasswordViaEmail;
exports.validateEmail = validateEmail;
