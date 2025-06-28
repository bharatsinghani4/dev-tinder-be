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

const validateProfileEditData = (req) => {
  const allowedEditFields = ["age", "about", "gender", "photoURL", "skills"];
  const isValidEdit = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );

  return isValidEdit;
};

module.exports = { validateSignUpData, validateProfileEditData };
