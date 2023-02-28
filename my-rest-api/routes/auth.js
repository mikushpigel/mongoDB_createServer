const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../model/users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email or password!");
    return;
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    res.status(400).send("invalid email or password!");
    return;
  }

  const token = user.generateAuthToken();

  res.send({ token });
});

const validateAuth = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user, { abortEarly: false });
};

module.exports = router;
