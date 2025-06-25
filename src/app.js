const express = require("express");

const app = express();

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});
