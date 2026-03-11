const express = require("express");

require("dotenv").config();

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

// Signup
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`Failed to save user: ${error.message}`);
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
  const _id = req.body._id;

  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      res.status(404).send("User does not exist");
    }

    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update user
app.patch("/user", async (req, res) => {
  const _id = req.body._id;

  try {
    await User.findByIdAndUpdate(_id, req.body);

    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
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