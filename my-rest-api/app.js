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

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardRouter = require("./routes/cards");

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/mycards", cardRouter);

const PORT = 3001;
app.listen(PORT, console.log(`listenning mongoDB on port ${PORT}`));
