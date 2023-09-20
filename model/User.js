const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  userName: String,
  email: String,
  password: String,
  profilePicture: String,
  firstName: String,
  lastName: String,
  gender: String,
  birthday: String,
  height: Number,
  weight: Number,
  dailyCalories: Number,
  exerciseLog: [
    {
      date: String,
      weight: String,
      startTime: String,
      duration: String,
      calories: String,
    },
  ],
  exerciseTime: Number,
  caloriesBurned: Number,
  liveExerciseTime: Number,
  liveCaloriesBurned: Number,
});

module.exports = mongoose.model("User", userSchema);
