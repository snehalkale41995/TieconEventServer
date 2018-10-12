const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { AppThemes, validateAppTheme } = require("../models/appTheme");

router.get("/", async (req, res) => {
  try {
    const appThemes = await AppThemes.find();
    res.send(appThemes);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var appTheme = new AppThemes(
    _.pick(req.body, [
      "appTitle",
      "themeColor",
      "textColor",
      "appThemeColorHex",
      "appTextColorHex",
      "appLogo"
    ])
  );
  try {
    const { error } = validateAppTheme(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    appTheme = await appTheme.save();
    res.send(appTheme);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateAppTheme(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const appTheme = await AppThemes.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "appTitle",
        "themeColor",
        "textColor",
        "appThemeColorHex",
        "appTextColorHex",
        "appLogo"
      ]),
      { new: true }
    );
    if (!appTheme)
      return res.status(404).send("The Event with the given ID was not found.");
    res.send(appTheme);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
