const mongoose = require("mongoose");

const SessionTypeList = mongoose.model(
  "SessionTypeList",
  new mongoose.Schema({
    sessionTypes: Array
  })
);

exports.SessionTypeList = SessionTypeList;
