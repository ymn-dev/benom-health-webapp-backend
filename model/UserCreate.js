const mongoose = require("mongoose");

const userCreateSchema = new mongoose.Schema({
  _id: String,
  userName: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("UserCreate", userCreateSchema);
