const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoURL skills age about";

// Get connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send(connections.map((field) => field.fromUserId));
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get al the pending connection requests for the looged in user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send(pendingRequests);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get the feed(recommendations)

module.exports = userRouter;
