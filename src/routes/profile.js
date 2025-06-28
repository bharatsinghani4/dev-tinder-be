const express = require("express");

const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

// Get User profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Edit User profile

// Edit User password

module.exports = profileRouter;
