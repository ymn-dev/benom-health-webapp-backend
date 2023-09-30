const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  _id: String,
  user: String,
  date: String,
  weight: String,
  startTime: String,
  duration: String,
  calories: String,
  picture: String,
});

module.exports = mongoose.model("Exercise", exerciseSchema, "activities");
