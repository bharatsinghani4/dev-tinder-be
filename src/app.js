const express = require("express");

const app = express();

app.get("/user", (req, res, next) => {
  throw new Error("sdfsdfssdf");
  res.send("User data sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});
