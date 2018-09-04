const mongoose = require("mongoose");
const Joi = require("joi");

const AboutUs = mongoose.model(
  "AboutUs",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    info: {
      type: String,
      required: true
    },
    url: String
  })
);

const AboutEternus = mongoose.model(
  "AboutEternus",
  new mongoose.Schema({
    info: {
      type: String,
      required: true
    },
    url: String
  })
);

const Helpdesk = mongoose.model(
  "Helpdesk",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    eventSupportEmail: {
      type: String,
      required: true
    },
    eventSupportContact: {
      type: Number,
      required: true
    },
    techSupportEmail: {
      type: String,
      required: true
    },
    techSupportContact: {
      type: Number,
      required: true
    }
  })
);

const EventLocation = mongoose.model(
  "EventLocation",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    address: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    latitudeDelta: {
      type: Number,
      required: true
    },
    longitudeDelta: {
      type: Number,
      required: true
    }
  })
);

function validateAboutUs(about) {
  const schema = {
    info: Joi.string().required(),
    url: Joi.string().allow(""),
    event: Joi.required()
  };
  return Joi.validate(about, schema);
}

function validateAboutEternus(about) {
  const schema = {
    info: Joi.string().required(),
    url: Joi.string().allow(""),
  };
  return Joi.validate(about, schema);
}
function validateHelpDesk(helpdesk) {
  const schema = {
    event: Joi.required(),
    eventSupportEmail: Joi.string().required(),
    eventSupportContact: Joi.number().required(),
    techSupportEmail: Joi.string().required(),
    techSupportContact: Joi.number().required()
  };
  return Joi.validate(helpdesk, schema);
}
function validateLocation(location) {
  const schema = {
    event: Joi.required(),
    address: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    latitudeDelta: Joi.number().required(),
    longitudeDelta: Joi.number().required()
  };
  return Joi.validate(location, schema);
}

exports.AboutUs = AboutUs;
exports.AboutEternus = AboutEternus;
exports.Helpdesk = Helpdesk;
exports.EventLocation = EventLocation;

exports.validateAboutUs = validateAboutUs;
exports.validateAboutEternus = validateAboutEternus;
exports.validateHelpDesk = validateHelpDesk;
exports.validateLocation = validateLocation;
