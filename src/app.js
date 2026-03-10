const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from the server");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test server");
});

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});
