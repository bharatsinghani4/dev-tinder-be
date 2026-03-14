const bcrypt = require("bcrypt");
const express = require("express");
const validator = require("validator");

const User = require("../models/user");

const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the request body
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Store the user into the database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // Validate emailId
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    // Compare password with hashedPassword
    const user = await User.findOne({ emailId });
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      res.status(400).send("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token);
    res.json({ data: user, message: "Login successful" });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Logout
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null);
    res.send("Logged out successfully");
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = authRouter;
