const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
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
    },
    photoURL: {
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
      type: String,
    },
    about: {
      default: "This is the default about of the user.",
      type: String,
    },
    skills: [String],
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
