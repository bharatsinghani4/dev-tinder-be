const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const {
      age,
      about,
      emailId,
      firstName,
      gender,
      lastName,
      password,
      photoURL,
      skills,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      age,
      about,
      emailId,
      firstName,
      gender,
      lastName,
      password: hashedPassword,
      photoURL,
      skills,
    });

    await user.save();

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 24 hours
    });
    res.json({ data: user, message: "User added successfully" });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 24 hours
      });
      res.json({ user: user, message: "Login successful!" });
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Successfully logged out");
});

module.exports = authRouter;
