const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must 4-50 characters long");
  } else if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last name must 4-50 characters long");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_EDITS = ["about", "age", "gender", "photoUrl", "skills"];
  const isEditAllowed = Object.keys(req.body).every((k) =>
    ALLOWED_EDITS.includes(k),
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
