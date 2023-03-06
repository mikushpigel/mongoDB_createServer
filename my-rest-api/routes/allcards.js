const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");

const { Card } = require("../model/cards");

router.get("/", async (req, res) => {
  const all = await Card.find({});
  if (!all.length) {
    res.send("No cards on the list");
  }
  res.send(all);
});

module.exports = router;
