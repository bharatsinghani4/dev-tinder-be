const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const connectDB = require("./config/database");
const { userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json());
app.use(cookieParser());
require("dotenv").config();

// Signup
app.post("/signup", async (req, res) => {
  try {
    // Validate the request body
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Store the user into the database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // Validate emailId
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    // Compare password with hashedPassword
    const user = await User.findOne({ emailId });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).send("Invalid credentials");
    }

    const token = await jwt.sign({ _id: user._id }, "Singhani@1304", {
      expiresIn: "1d",
    });

    res.cookie("token", token);
    res.send("Login successful");
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Send connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending a connection request");

  res.send(`${user.firstName} has sent a connection request!`);
});

connectDB()
  .then(() => {
    console.log("Successfully connected to the database!");

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database!");
  });
