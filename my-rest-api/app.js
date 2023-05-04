require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
let cors = require("cors");
const {
  User,
  validateUser,
  validateEmail,
  validatePassword,
} = require("./model/users");
const { JWT_TOKEN } = require("./config/config");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost/my_rest_api")
  .then(() => console.log("mongoDB is conncected successfuly"))
  .catch(() => console.log("mongoDB disconnect"));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardRouter = require("./routes/cards");
const allCardsRouter = require("./routes/allcards");
const myFavsRouter = require("./routes/fav");
const myBuyListRouter = require("./routes/buylist");

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/mycards", cardRouter);
app.use("/allcards", allCardsRouter);
app.use("/myfav", myFavsRouter);
app.use("/mybuylist", myBuyListRouter);

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

app.post("/forgot-password", async (req, res) => {
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

  const secret = JWT_TOKEN + isExist.password;
  const payload = {
    email: email,
    _id: isExist._id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  res.status(200).send("founded");
});

const PORT = 3001;
app.listen(PORT, console.log(`listenning mongoDB on port ${PORT}`));
