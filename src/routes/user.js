const express = require("express");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

// Get user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {});

// Get requests recieved by user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {});

// Get user feed
userRouter.get("/user/feed", userAuth, async (req, res) => {});

module.exports = userRouter;
