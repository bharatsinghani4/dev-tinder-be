const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  age: Number,
  emailId: String,
  firstName: String,
  gender: String,
  lastName: String,
  password: String,
});

const User = model("User", userSchema);

module.exports = User;
