const express = require("express");
const router = express.Router();
const {
  User,
  validateUser,
  validateEmail,
  validatePassword,
} = require("../model/users");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMW = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = require("../config/config");
const nodemailer = require("nodemailer");
const { config } = require("dotenv");

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

router.post("/recovery-password", async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details[0].message);
    return;
  }
  const { email } = req.body;
  const isExist = await User.findOne({ email: email });
  if (!isExist) {
    res.status(400).send("email does not exist!");
    return;
  }

  console.log("founded", email);

  const secret = JWT_TOKEN + isExist.password;
  const payload = {
    email: email,
    _id: isExist._id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  res.status(200).send("founded");
  const link = `http://localhost:3001/users/reset-password/${isExist._id}/${token}`;
  console.log(link);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yammyrecipess@gmail.com",
      pass: "chfwoiuudzpnvljk",
    },
  });

  var mailOptions = {
    from: "yammyrecipess@gmail.com",
    to: email,
    subject: "reset-password",
    text: link,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    res.status(400).send("User ID not Exists!");
    return;
  }
  const secret = JWT_TOKEN + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    console.log("verify:--->", verify);
    res.render("index", { email: verify.email });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const { error } = validatePassword(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    res.status(400).send("User not Exists!");
    return;
  }
  const secret = JWT_TOKEN + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);

    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: await bcrypt.hash(password, 12),
        },
      }
    );
    res.send("password update successfuly");
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

module.exports = router;
