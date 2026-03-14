const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// Send connection request as interested
requestRouter.post("/request/interested", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending a connection request as interested");

  res.send(`${user.firstName} has sent a connection request!`);
});

// Ignore connection request
requestRouter.post("/request/ignored", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Ignoring a connection request");

  res.send(`${user.firstName} has sent a connection request!`);
});

// Accept connection request
requestRouter.post("/request/accept", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Accepting a connection request");

  res.send(`${user.firstName} has sent a connection request!`);
});

// Reject connection request
requestRouter.post("/request/reject", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Rejecting a connection request");

  res.send(`${user.firstName} has sent a connection request!`);
});

module.exports = requestRouter;
