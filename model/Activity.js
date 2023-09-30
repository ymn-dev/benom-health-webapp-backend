const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  _id: String,
  exerciseLog: [
    {
      _id: String,
      date: String,
      weight: String,
      startTime: String,
      duration: String,
      calories: String,
      picture: String,
      createdTime: String,
      deleted: Boolean,
    },
  ],
});

module.exports = mongoose.model("Activity", exerciseSchema, "activities");
