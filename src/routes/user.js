const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const USER_SAFE_DATA = "about age firstName lastName photoURL skills";

// Get pending requests recieved by logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!connectionRequests.length) throw new Error("No requests found");

    res.json({
      data: connectionRequests,
      message: "Connection requests fetched successfully",
    });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Get user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!connections.length) throw new Error("No connections found");

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.fromUserId;

      return row.fromUserId;
    });

    res.json({
      data: connections,
      message: "Connections fetched successfully",
    });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Get user feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = userRouter;
