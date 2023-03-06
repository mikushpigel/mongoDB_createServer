require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
let cors = require("cors");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost/my_rest_api")
  .then(() => console.log("mongoDB is conncected successfuly"))
  .catch(() => console.log("mongoDB disconnect"));

app.set("view engine", "ejs");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardRouter = require("./routes/cards");
const allCardsRouter = require("./routes/allcards");

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/mycards", cardRouter);
app.use("/allcards", allCardsRouter);

const PORT = 3001;
app.listen(PORT, console.log(`listenning mongoDB on port ${PORT}`));
