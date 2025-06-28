const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
  {
    about: {
      default: "This is the default about of the user.",
      type: String,
      maxLength: 200,
    },
    age: {
      min: 18,
      type: Number,
    },
    emailId: {
      lowercase: true,
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    firstName: {
      maxLength: 30,
      minLength: 4,
      trim: true,
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Not a valid gender.");
        }
      },
    },
    lastName: {
      trim: true,
      type: String,
      required: true,
    },
    password: {
      trim: true,
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    photoURL: {
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Can not add more than 10 skills");
        }
      },
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
