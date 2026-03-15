const express = require("express");

const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    res.status(400).json({ message: `ERROR: ${error.message}` });
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
        return row.toUserId;

      return row.fromUserId;
    });

    res.json({
      data,
      message: "Connections fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

// Get user feed
userRouter.get("/user/feed?page=1&limit=10", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    let hideUserFromFeed = new Set();

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    if (connectionRequests.length) {
      connectionRequests.forEach((request) => {
        hideUserFromFeed.add(request.fromUserId);
        hideUserFromFeed.add(request.toUserId);
      });
    }

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    const message =
      users.length ? "Feed fetched successfully" : "No users found";

    res.json({ data: users, message });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

module.exports = userRouter;
