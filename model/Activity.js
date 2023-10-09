const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  _id: String,
  exerciseTime: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  liveExerciseTime: { type: Number, default: 0 },
  liveCaloriesBurned: { type: Number, default: 0 },
  exerciseLog: [
    {
      _id: String,
      exerciseName: String,
      date: Date,
      dateTime: Date,
      weight: String,
      startTime: String,
      duration: String,
      calories: Number,
      picture: String,
      createdTime: Date,
      deleted: Boolean,
    },
  ],
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Activity", exerciseSchema, "activities");
