const { json } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = require("../config/config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(400).send("no token provided!");
    return;
  }

  try {
    const decoding = jwt.verify(token, JWT_TOKEN);

    req.userId = decoding._id;
    next();
  } catch {
    res.status(400).send("invalid token");
  }
};
