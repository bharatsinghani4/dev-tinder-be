const express = require("express");

const app = express();

app.get(/.*fly$/, (req, res) => {
  res.send({
    firstName: "Bharat",
    lastName: "Singhani",
  });
});

app.use("/user?userId=xyz", (req, res) => {
  console.log(req.query);
  res.send("Hello from the server");
});

app.use("/user/:userId/:name", (req, res) => {
  console.log(req.params);
  res.send("Hello from the server");
});

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});
