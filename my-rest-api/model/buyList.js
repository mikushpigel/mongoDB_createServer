const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const { join, isEmpty } = require("lodash");

const buyListSchema = new mongoose.Schema({
  prod: {
    type: String,
    required: true,
  },
  id: {
    type: mongoose.Schema.Types.Mixed,
  },
  isComplete: {
    type: Boolean,
    required: true,
  },
  isEdit: {
    type: Boolean,
    required: true,
  },
  amount: {
    type: Number,
  },
  unit: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Buylist = mongoose.model("Buylist", buyListSchema, "buy-lists");

const ValidateList = (item) => {
  const schema = Joi.object({
    prod: Joi.string().required(),
    id: Joi.required(),
    isComplete: Joi.boolean().required(),
    isEdit: Joi.boolean().required(),
    amount: Joi.number().allow(""),
    unit: Joi.allow(""),
  });
  return schema.validate(item, { abortEarly: false });
};

const validateItemForUpdate = (item) => {
  const schema = Joi.object({
    prod: Joi.string(),

    isComplete: Joi.boolean(),
    isEdit: Joi.boolean(),
    amount: Joi.allow(""),
    unit: Joi.allow(""),
  });
  return schema.validate(item, { abortEarly: false });
};

module.exports = {
  Buylist,
  ValidateList,
  validateItemForUpdate,
};
