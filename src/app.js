const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("All data sent");
});

app.delete("/admin/deleteUser", (req, res, next) => {
  res.send("User deleted");
});

app.get("/user", userAuth, (req, res, next) => {
  res.send("User details");
});

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});
