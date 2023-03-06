const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { JWT_TOKEN } = require("../config/config");

//We've got a schema with properties name,email which will be a String. The next step is compiling our schema into a Model.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 255,
    required: true,
  },
  email: {
    type: String,
    minLength: 6,
    maxLength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 1024,
    required: true,
  },
  biz: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, biz: this.biz }, JWT_TOKEN);
  return token;
};
//A model is a class with which we construct documents. In this case, each document will be a kitten with properties and behaviors as declared in our schema.
const User = mongoose.model("User", userSchema, "users");

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1024).required(),
    biz: Joi.boolean().required(),
  });
  return schema.validate(user, { abortEarly: false });
};

const validateEmail = (userEmail) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(userEmail);
};
const validatePassword = (userPass) => {
  const schema = Joi.object({
    password: Joi.string().min(6).max(1024).required(),
    "confirm-password": Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });
  return schema.validate(userPass);
};

module.exports = {
  User,
  validateUser,
  validateEmail,
  validatePassword,
};
