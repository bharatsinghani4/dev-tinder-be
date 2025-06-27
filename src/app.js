const express = require("express");
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
  } catch (err) {
    res.status(400).send("Failed to add the user: " + err.message);
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
app.patch("/user", async (req, res) => {
  try {
    await User.findByIdAndUpdate({ _id: req.body.userId }, req.body, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
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
