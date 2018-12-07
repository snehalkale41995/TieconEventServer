const mongoose = require("mongoose");
const Joi = require("joi");

const QuestionForms = mongoose.model(
  "QuestionForms",
  new mongoose.Schema({
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Events",
      required: true
    },
    formType: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref : 'FormTypes',
      type: String,
      required: true
    },
    formData: {
      type: Array,
      required: true
    }
  })
);

function validateQuestionForm(form) {
  const schema = {
    event: Joi.required(),
    formType: Joi.required(),
    formData: Joi.required()
  };
  return Joi.validate(form, schema);
}
exports.QuestionForms = QuestionForms;
exports.validateQuestionForm = validateQuestionForm;
