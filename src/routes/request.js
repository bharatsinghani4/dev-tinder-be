const express = require("express");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// Send connection request as interested/Ignore connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;
      const ALLOWED_STATUS = ["ignored", "interested"];
      const toUser = await User.findById(toUserId);

      if (!toUser) return res.status(404).json({ message: "User not found" });

      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ message: `${status} is not a valid status type` });
      }

      // Check for an existing connection request between from user and to user
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest)
        return res
          .status(400)
          .json({ message: "Connection request already exists" });

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        data,
        message:
          status === "interested" ?
            `${req.user.firstName} is interested in ${toUser.firstName}`
          : `${req.user.firstName} ignored ${toUser.firstName}`,
      });
    } catch (error) {
      res.status(400).send(`ERROR: ${error.message}`);
    }
  },
);

// Accept connection request
requestRouter.post(
  "/request/review/accepted:requestId",
  userAuth,
  async (req, res) => {
    const user = req.user;

    console.log("Accepting a connection request");

    res.send(`${user.firstName} has sent a connection request!`);
  },
);

// Reject connection request
requestRouter.post(
  "/request/review/rejected:requestId",
  userAuth,
  async (req, res) => {
    const user = req.user;

    console.log("Rejecting a connection request");

    res.send(`${user.firstName} has sent a connection request!`);
  },
);

module.exports = requestRouter;
