const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../model/users");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMW = require("../middleware/auth");

router.get("/me", authMW, async (req, res) => {
  const user = await User.findById(req.userId, { password: 0 });
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("user is already registerd!");
    return;
  }

  user = await new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
  }).save();

  res.send(_.pick(user, ["name", "email", "biz", "_id"]));
});

module.exports = router;
