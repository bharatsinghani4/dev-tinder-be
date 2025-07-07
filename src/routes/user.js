const express = require("express");

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
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
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    res.send(
      connections.map((field) => {
        if (field.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return field.toUserId;
        }

        return field.fromUserId;
      })
    );
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get al the pending connection requests for the looged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
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
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    let limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    limit = limit > 50 ? 50 : limit;

    const loggedInUser = req.user;
    const existingConnectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });
    // These will contain ids of the logged in user as well as of those with whom it has a connection request associated
    const hideUsersFromFeed = new Set();
    existingConnectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(feedUsers);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
