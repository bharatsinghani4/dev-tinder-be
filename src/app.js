const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Route handler 1");
    next();
  },
  (req, res, next) => {
    console.log("Route handler 2");
    next();
  },
  [
    (req, res, next) => {
      console.log("Route handler 3");
      next();
    },
    (req, res, next) => {
      console.log("Route handler 4");
      next();
    },
  ],
  (req, res, next) => {
    console.log("Route handler 5");
    res.send("Response 5");
  },
);

app.listen(1304, () => {
  console.log("Server is listening on port 1304...");
});
