const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

// Get User profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Edit User profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Edit User password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPassword = req.body.password;

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Enter a strong password");
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newPasswordHashed;
    await loggedInUser.save();
    res.send("Password updated succesfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
