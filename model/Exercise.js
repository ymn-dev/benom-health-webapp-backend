const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  date: String,
  weight: String,
  startTime: String,
  duration: String,
  calories: String,
});

module.exports = mongoose.model("ExerciseLog", exerciseSchema);
