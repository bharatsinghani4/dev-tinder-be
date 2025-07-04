const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Not a valid gender.");
      //   }
      // },
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

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Singhani@1304", {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = model("User", userSchema);

module.exports = User;
