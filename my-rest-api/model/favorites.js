const mongoose = require("mongoose");
const _ = require("lodash");
const Joi = require("joi");
const { string } = require("joi");

const favoriteSchema = new mongoose.Schema({
  fullRecipe: {
    type: Object,
    required: true,
  },
  id: Number,
  title: String,
  image: String,
  likes: Number,
  missedIngredientCount: Number,
  missedIngredients: Array,
  usedIngredients: Array,
  isInfo: Boolean,
  isFavorite: Boolean,
  FavNumber: {
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

const Fav = mongoose.model("Fav", favoriteSchema, "favorites");

const ValidateFav = (fav) => {
  const schema = Joi.object({
    fullRecipe: Joi.object().required(),
    id: Joi.number(),
    image: Joi.string(),
    title: Joi.string(),
    likes: Joi.number(),
    missedIngredientCount: Joi.number(),
    missedIngredients: Joi.array(),
    usedIngredients: Joi.array(),
    isInfo: Joi.boolean(),
    isFavorite: Joi.boolean(),
  });
  return schema.validate(fav, { abortEarly: false });
};

const generateFavNumber = async () => {
  while (true) {
    let random = _.random(100, 999999999999);
    let isExistentNumber = await Fav.findOne({ favNumber: random });
    if (!isExistentNumber) {
      return random;
    }
  }
};

module.exports = {
  Fav,
  ValidateFav,
  generateFavNumber,
};
