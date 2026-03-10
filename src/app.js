const express = require("express");

require("dotenv").config();

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// Signup
app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Shubhi",
    lastName: "Jain",
    emailId: "shubhi.jain@gmail.com",
    password: "Password@123",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`Failed to save user: ${error.message}`);
  }
});

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
