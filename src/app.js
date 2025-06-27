const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Failed to add the user: " + err.message);
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
