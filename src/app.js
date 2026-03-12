const bcrypt = require("bcrypt");
const validator = require("validator");
const express = require("express");

require("dotenv").config();

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json());

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

    res.send("Login successful");
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// Feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users.length) {
      res.status(404).send("No users found");
    }

    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      res.status(404).send("User not found");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).send("User does not exist");
    }

    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["about", "age", "gender", "photoUrl", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    await User.findByIdAndUpdate(userId, { data }, { runValidators: true });

    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("User update failed" + error.message);
  }
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
