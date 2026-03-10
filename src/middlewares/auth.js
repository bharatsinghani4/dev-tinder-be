const adminAuth = (req, res, next) => {
  const token = "admin";
  const isAdminAuthorized = token === "admin";

  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request");
  }
};

const userAuth = (req, res, next) => {
  const token = "user";
  const isUserAuthorized = token === "user";

  if (isUserAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
