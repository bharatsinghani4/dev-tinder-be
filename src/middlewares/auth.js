const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token fromthe req.cookies
    const { token } = req.cookies;

    // Validate the token
    if (!token) throw new Error("Invalid token");

    // Find the user
    const decodedObj = await jwt.verify(token, "Singhani@1304");
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) throw new Error("User does not exist");

    // Attach user to request and move to the next request handler
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
