const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
  {
    about: {
      default: "This is the default about of the user.",
      maxLength: 200,
      type: String,
    },
    age: {
      min: 18,
      type: Number,
    },
    emailId: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email adress");
        }
      },
      unique: true,
    },
    firstName: {
      maxLength: 30,
      minLength: 4,
      required: true,
      trim: true,
      type: String,
    },
    gender: {
      enum: {
        values: ["male", "female", "other"],
        message: `${VALUE} is not a valid gender type`,
      },
      type: String,
    },
    lastName: {
      required: true,
      trim: true,
      type: String,
    },
    password: {
      required: true,
      trim: true,
      type: String,
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
          throw new Error("Invalid photo URL");
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
    isPremium: {
      default: false,
      type: Boolean,
    },
    membership: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

module.exports = User;
