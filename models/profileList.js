const mongoose = require("mongoose");

const ProfileList = mongoose.model(
  "ProfileList",
  new mongoose.Schema({
    profiles: Array
  })
);

exports.ProfileList = ProfileList;
