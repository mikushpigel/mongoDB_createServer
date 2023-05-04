const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const { Fav, generateFavNumber, ValidateFav } = require("../model/favorites");

router.post("/", authMW, async (req, res) => {
  const { error } = ValidateFav(req.body);
  if (error) {
    const { details } = error;
    res.status(400).send(details.map((detail) => detail.message));
    return;
  }
  const recipe = await new Fav({
    ...req.body,
    user_id: req.userId,
    FavNumber: await generateFavNumber(),
  }).save();

  res.send(recipe);
});

router.get("/all", authMW, async (req, res) => {
  const favs = await Fav.find({ user_id: req.userId });
  res.send(favs);
});

router.delete("/delete/:id", authMW, async (req, res) => {
  const fav = await Fav.findOneAndDelete({
    _id: req.params.id,
    user_id: req.userId,
  });

  if (!fav) {
    res.status(404).send("fav card with the given ID not found");
    return;
  }
  res.send(fav);
});
router.delete("/deleteAll", authMW, async (req, res) => {
  const fav = await Fav.deleteMany({});

  if (!fav) {
    res.status(404).send("no favs found to delete");
    return;
  }
  res.send(fav);
});
module.exports = router;
