const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  bizDescription: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 1024,
  },
  bizAddress: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 400,
  },
  bizPhone: {
    type: String,
    required: true,
    minLength: 9,
    maxLength: 10,
  },
  bizImage: {
    type: String,
    required: true,
    minLength: 11,
    maxLength: 1024,
  },
  bizNumber: {
    type: Number,
    required: true,
    min: 100,
    max: 999_999_999_999,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema, "cards");

const validateCard = (card) => {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizPhone: Joi.string().min(9).max(10).required(),
    bizImage: Joi.string().min(11).max(1024).uri(),
  });
  return schema.validate(card, { abortEarly: false });
};

const generateCardNumber = async () => {
  while (true) {
    let random = _.random(100, 999999999999);
    let isExistentNumber = await Card.findOne({ bizNumber: random });
    if (!isExistentNumber) {
      return random;
    }
  }
};

const validateForUpdate = (card) => {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255),
    bizDescription: Joi.string().min(2).max(1024),
    bizAddress: Joi.string().min(2).max(400),
    bizPhone: Joi.string().min(9).max(10),
    bizImage: Joi.string().min(11).max(1024).uri(),
  });
  return schema.validate(card, { abortEarly: false });
};

module.exports = {
  Card,
  validateCard,
  validateForUpdate,
  generateCardNumber,
};
