const cookieParser = require("cookie-parser");
const express = require("express");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
require("dotenv").config();

connectDB()
  .then(() => {
    console.log("Successfully connected to the database!");

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database!");
  });
