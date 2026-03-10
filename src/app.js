const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstName: "Bharat",
    lastName: "Singhani",
  });
});

app.post("/user", (req, res) => {
  res.send("User successfully saved to the database!");
});

app.delete("/user", (req, res) => {
  res.send("User successfully deleted from the database!");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test server");
});

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});
