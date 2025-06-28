const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Signup
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const {
      age,
      about,
      emailId,
      firstName,
      gender,
      lastName,
      password,
      photoURL,
      skills,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      age,
      about,
      emailId,
      firstName,
      gender,
      lastName,
      password: hashedPassword,
      photoURL,
      skills,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "Singhani@1304");

      res.cookie("token", token);
      res.send("Login successful!");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// User profile
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Session expired. Please login.");
    }

    const { _id } = await jwt.verify(token, "Singhani@1304");
    const user = await User.findOne({ _id });

    if (!user) {
      throw new Error("User not found");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Get all users form the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update a user
app.patch("/user/:userId", async (req, res) => {
  const ALLOWED_UPDATES = ["skills", "photoURL", "about", "gender", "age"];

  try {
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    await User.findByIdAndUpdate({ _id: req.params?.userId }, req.body, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection to the database established successfully!");
    app.listen(1304, () => {
      console.log("Server is listening on port 1304...");
    });
  })
  .catch((err) => console.error("Failed to connect to the database!"));
