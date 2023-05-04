const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const {
  Card,
  validateCard,
  generateCardNumber,
  validateForUpdate,
} = require("../model/cards");
const Joi = require("joi");

router.post("/create", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }
  const card = await new Card({
    ...req.body,
    bizImage: req.body.bizImage || "https://picsum.photos/200/300",
    user_id: req.userId,
    bizNumber: await generateCardNumber(),
  }).save();

  res.send(card);
});

router.patch("/update/:id", authMW, async (req, res) => {
  const card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.userId },
    req.body,
    { new: true }
  );
  if (!card) {
    res.status(400).send("only owner can update their cards");
    return;
  }
  const { bizName, bizDescription, bizAddress, bizPhone, bizImage } = card;
  const { error } = validateForUpdate({
    bizName,
    bizAddress,
    bizDescription,
    bizImage,
    bizPhone,
  });

  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }
  res.send(card);
});

router.get("/all", authMW, async (req, res) => {
  const cards = await Card.find({ user_id: req.userId });
  res.send(cards);
});

router.get("/find/:id", authMW, async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id, user_id: req.userId });
  if (!card) {
    res.status(400).send("No card found with this ID");
    return;
  }

  res.send(card);
});

router.delete("/delete/:id", authMW, async (req, res) => {
  const card = await Card.findByIdAndRemove({
    _id: req.params.id,
    user_id: req.userId,
  });

  if (!card) {
    res.status(404).send("No card found with this ID");
    return;
  }
  res.send(card);
});

module.exports = router;
