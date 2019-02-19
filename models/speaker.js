const mongoose = require("mongoose");
const Joi = require("joi");
const nodemailer = require("nodemailer");
// const bcrypt = require("bcrypt");
const generator = require("generate-password");

const Speaker = mongoose.model(
  "Speaker",
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
      required: true
    },
    roleName: String,
    attendeeLabel: String,
    attendeeCount: Number,
    briefInfo: String,
    info : String,
    profileImageURL: String,
    facebookProfileURL: String,
    linkedinProfileURL: String,
    twitterProfileURL:String,
    isEmail:false,
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    }
  })
);

function validateSpeaker(speaker) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().allow(""),
    contact: Joi.number().required(),
    roleName: Joi.string(),
    attendeeLabel: Joi.string(),
    attendeeCount: Joi.number(),
    briefInfo: Joi.string().allow(""),
    info: Joi.string().allow(""),
    profileImageURL: Joi.string().allow(""),
    facebookProfileURL:Joi.string().allow(""),
    linkedinProfileURL:Joi.string().allow(""),
    twitterProfileURL:Joi.string().allow(""),
    isEmail:Joi.boolean(),
    event: Joi.required()
  };
  return Joi.validate(speaker, schema);
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

async function sendPasswordViaEmail(password, email, name) {
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
    subject: "Password for User " + name + " for Event management Application",
    html:
      "<p>Hello " +
      name +
      ",</p><p>Greetings from Event management. </p> <p>Your Password for account registered through " +
      email +
      " is as " +
      password +
      " .Please Login for better experience .</p>"
  };
  transporter.sendMail(mailOptions);
}

exports.Speaker = Speaker;
exports.validateSpeaker = validateSpeaker;
exports.validateAuthUser = validateAuthUser;
// exports.generatePassword = generatePassword;
exports.sendPasswordViaEmail = sendPasswordViaEmail;
