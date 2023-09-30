const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Activity = require("../model/Activity.js");
const { errorHandler } = require("../utils.js");

const activitiesRouter = express.Router({ mergeParams: true });
activitiesRouter.use(express.json());
activitiesRouter.use(express.urlencoded({ extended: true }));

activitiesRouter.param("activityId", async (req, res, next, id) => {
  try {
    const activities = await Activity.findOne({ _id: req.userId });
    const activityIndex = activities.exerciseLog.findIndex((exercise) => exercise._id === id);
    if (activityIndex === -1 || activities.exerciseLog[activityIndex].deleted) {
      return errorHandler(`activity not found`, next, 404);
    }
    req.activities = activities;
    req.activityIndex = activityIndex;
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const myLog = await Activity.findById(req.userId);
    const filterDeletedLog = myLog.exerciseLog.filter((exercise) => !exercise.deleted);
    res.json({
      data: {
        _id: myLog._id,
        exerciseLog: filterDeletedLog,
      },
    });
  } catch (err) {
    errorHandler(err, next);
  }
});

//add activity
activitiesRouter.post("/", async (req, res, next) => {
  try {
    const { exerciseName, date, weight, startTime, duration, calories, picture } = req.body;
    if (!exerciseName || !date || !weight || !startTime || !duration) {
      return errorHandler(`missing fields`, next, 400);
    }
    const _id = crypto.randomUUID();
    const deleted = false;
    const userWeight = req.weight || weight;
    const newActivity = {
      _id,
      exerciseName,
      date,
      weight: userWeight,
      startTime,
      duration,
      calories,
      picture,
      createdTime: new Date().getTime(),
      deleted,
    };
    const result = await Activity.updateOne({ _id: req.userId }, { $push: { exerciseLog: newActivity } });
    if (result.acknowledged) {
      res.json({
        message: `successfully updated activity`,
        data: newActivity,
      });
    } else {
      return; //to catch block
    }
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.get("/:activityId", async (req, res, next) => {
  res.json({
    data: req.activities.exerciseLog[req.activityIndex],
  });
  next();
});

activitiesRouter.patch("/:activityId", async (req, res, next) => {
  try {
    const myLog = req.activities;
    const myActivity = myLog.exerciseLog[req.activityIndex];
    const { startTime, duration, calories, picture } = req.body;
    if (startTime) myActivity.startTime = startTime;
    if (duration) myActivity.duration = duration;
    if (calories) myActivity.calories = calories;
    if (picture) myActivity.picture = picture;
    const updatedActivity = await myLog.save();
    res.json({
      message: `successfully updated activity `,
      data: updatedActivity,
    });
    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.delete("/:activityId", async (req, res, next) => {
  try {
    const myLog = req.activities;
    const myActivity = myLog.exerciseLog[req.activityIndex];
    myActivity.deleted = true;
    await myLog.save();
    res.json({
      message: `successfully deleted activity`,
      data: {
        exerciseName: myActivity.exerciseName,
        date: myActivity.date,
        startTime: myActivity.startTime,
      },
    });

    next();
  } catch (err) {
    errorHandler(err, next);
  }
});

activitiesRouter.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = activitiesRouter;
