const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("Invalid first name.");
  } else if (!lastName) {
    throw new Error("Invalid last name.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a stromg password.");
  }
};

module.exports = validateSignUpData;
