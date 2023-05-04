const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const {
  Buylist,
  ValidateList,
  validateItemForUpdate,
} = require("../model/buyList");

router.post("/", authMW, async (req, res) => {
  const { error } = ValidateList(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }
  const buylist = await new Buylist({
    ...req.body,
    user_id: req.userId,
  }).save();

  res.send(buylist);
});

router.get("/all", authMW, async (req, res) => {
  const favs = await Buylist.find({ user_id: req.userId });
  res.send(favs);
});

router.get("/:id", authMW, async (req, res) => {
  const item = await Buylist.findOne({
    _id: req.params.id,
    user_id: req.userId,
  });
  if (!item) {
    res.status(400).send("No item found with this ID");
    return;
  }

  res.send(item);
});

router.delete("/delete/:id", authMW, async (req, res) => {
  const list = await Buylist.findOneAndDelete({
    _id: req.params.id,
    user_id: req.userId,
  });

  if (!list) {
    res.status(404).send("the list with the given ID not found");
    return;
  }
  res.send(list);
});

router.delete("/deleteAll", authMW, async (req, res) => {
  const item = await Buylist.deleteMany({});

  if (!item) {
    res.status(404).send("no items found to delete");
    return;
  }
  res.send(item);
});

router.patch("/edit/:id", authMW, async (req, res) => {
  const item = await Buylist.findByIdAndUpdate(
    { _id: req.params.id, user_id: req.userId },
    req.body,
    { new: true }
  );
  console.log(item);
  console.log(req.body);
  if (!item) {
    res.status(400).send("item with the given ID not found");
    return;
  }

  const { prod, isComplete, isEdit, amount, unit } = item;
  const { error } = validateItemForUpdate({
    prod,
    isComplete,
    isEdit,
    amount,
    unit,
  });
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }

  res.send(item);
});
module.exports = router;
