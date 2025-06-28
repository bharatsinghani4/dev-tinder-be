const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// Send connection request - ignore
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const sendingUser = req.user;
    const recievingUser = req.body.userId;
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Send connection request - interested

// Review connection request - accept

// Review connection request - reject

module.exports = requestRouter;
