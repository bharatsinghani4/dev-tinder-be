const bcrypt = require("bcrypt");
const express = require("express");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// Get profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({ data: user });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateEditProfileData(req);

    if (!isEditAllowed) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      data: loggedInUser,
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
    });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Update password
profileRouter.patch("/profile/password/forgot", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPlainPassword = req.body.newPassword;
    const confirmNewPlainPassword = req.body.confirmNewPassword;

    if (newPlainPassword !== confirmNewPlainPassword)
      throw new Error("Passwords didn't match");

    if (!validator.isStrongPassword(newPlainPassword))
      throw new Error("Please enter a strong password");

    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.json({ data: loggedInUser, message: "Password updated successfully" });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = profileRouter;
