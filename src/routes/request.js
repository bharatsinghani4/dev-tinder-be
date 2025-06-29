const express = require("express");

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

// Send connection request - ignored/interested
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;
      const ALLOWED_STATUSES = ["ignored", "interested"];
      const isAllowedStatus = ALLOWED_STATUSES.includes(status);
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          message:
            "The user whom you're trying to send a connection request doesn't exist",
        });
      }

      if (!isAllowedStatus) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message:
            "You can not send another connection request to the same user",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.json({
        message: `${req.user.firstName + req.user.lastName} has marked ${
          toUser.firstName + toUser.lastName
        } as ${status}`,
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

// Review connection request - accept
requestRouter.post(
  "/request/review/:status/:fromUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.user._id;
      const { fromUserId, status } = req.params;
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = requestRouter;
