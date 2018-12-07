const mongoose = require("mongoose");
const Joi = require("joi");

const AppThemes = mongoose.model(
  "AppThemes",
  new mongoose.Schema({
    appTitle: String,
    themeColor: Object,
    textColor: Object,
    appThemeColorHex: String,
    appTextColorHex: String,
    appLogo: String
  })
);

function validateAppTheme(appTheme) {
  const schema = {
    appTitle: Joi.string().required(),
    themeColor: Joi.object().required(),
    textColor: Joi.object().required(),
    appThemeColorHex: Joi.string().required(),
    appTextColorHex: Joi.string().required(),
    appLogo: Joi.string().required()
  };
  return Joi.validate(appTheme, schema);
}
exports.AppThemes = AppThemes;
exports.validateAppTheme = validateAppTheme;
