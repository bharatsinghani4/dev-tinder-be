const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://1pluswheels:xJL27iweeUYiH8Hh@devtinder.vqff5fj.mongodb.net/devTinderDB"
  );
};

module.exports = connectDB;
